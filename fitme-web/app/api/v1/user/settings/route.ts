import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { themeMode, notificationsEnabled } = body;
        const userId = await getUserId();

        await db.update(users).set({
            themeMode: themeMode,
            notificationsEnabled: notificationsEnabled ? 1 : 0,
            updatedAt: new Date(),
        }).where(eq(users.id, userId));

        return NextResponse.json({
            success: true,
            message: 'Settings synced successfully',
            data: { themeMode, notificationsEnabled }
        });
    } catch (error: any) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ success: false, message: 'Failed to update settings', error: error.message }, { status: 500 });
    }
}
