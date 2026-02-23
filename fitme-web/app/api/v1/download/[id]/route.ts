import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earlyAccessUsers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verify ID
        const [user] = await db.select()
            .from(earlyAccessUsers)
            .where(eq(earlyAccessUsers.id, id))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update download count
        await db.update(earlyAccessUsers)
            .set({ downloadCount: sql`${earlyAccessUsers.downloadCount} + 1`, updatedAt: new Date() })
            .where(eq(earlyAccessUsers.id, id));

        // Serve the file
        const filePath = path.join(process.cwd(), 'assets/builds/fitme-early-access.apk');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Disposition': 'attachment; filename="fitme-early-access.apk"',
            },
        });
    } catch (error: any) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
