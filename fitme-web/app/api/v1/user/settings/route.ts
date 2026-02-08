import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { themeMode, notificationsEnabled, geminiApiKey } = body;
        const userId = await getUserId();

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (themeMode !== undefined) updateData.themeMode = themeMode;
        if (notificationsEnabled !== undefined) updateData.notificationsEnabled = notificationsEnabled ? 1 : 0;
        if (geminiApiKey !== undefined) updateData.geminiApiKey = geminiApiKey;

        await db.update(users).set(updateData).where(eq(users.id, userId));

        return NextResponse.json({
            success: true,
            message: 'Settings synced successfully',
            data: { themeMode, notificationsEnabled, geminiApiKey: geminiApiKey ? '***' : null }
        });
    } catch (error: any) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ success: false, message: 'Failed to update settings', error: error.message }, { status: 500 });
    }
}
