import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();
        const userId = await getUserId();

        await db.update(users)
            .set({ geminiApiKey: apiKey, updatedAt: new Date() })
            .where(eq(users.id, userId));

        return NextResponse.json({
            success: true,
            message: 'API key updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating API key:', error);
        return NextResponse.json({ success: false, message: 'Failed to update API key', error: error.message }, { status: 500 });
    }
}
