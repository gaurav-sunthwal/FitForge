import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deviceTokens } from '@/lib/db/schema';
import { getUserId } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

// POST: Register device token
export async function POST(request: NextRequest) {
    try {
        const userId = await getUserId();
        const { token, platform } = await request.json();

        if (!token || !platform) {
            return NextResponse.json(
                { error: 'Token and platform are required' },
                { status: 400 }
            );
        }

        // Check if token already exists for this user
        const existingToken = await db.select()
            .from(deviceTokens)
            .where(eq(deviceTokens.token, token))
            .limit(1);

        if (existingToken.length > 0) {
            // Update existing token
            await db.update(deviceTokens)
                .set({ userId, platform, updatedAt: new Date() })
                .where(eq(deviceTokens.token, token));

            return NextResponse.json({
                success: true,
                message: 'Device token updated',
            });
        }

        // Insert new token
        await db.insert(deviceTokens).values({
            userId,
            token,
            platform,
        });

        return NextResponse.json({
            success: true,
            message: 'Device token registered',
        });
    } catch (error: any) {
        console.error('Device token registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Remove device token (for logout)
export async function DELETE(request: NextRequest) {
    try {
        const userId = await getUserId();
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        await db.delete(deviceTokens)
            .where(
                and(
                    eq(deviceTokens.userId, userId),
                    eq(deviceTokens.token, token)
                )
            );

        return NextResponse.json({
            success: true,
            message: 'Device token removed',
        });
    } catch (error: any) {
        console.error('Device token removal error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
