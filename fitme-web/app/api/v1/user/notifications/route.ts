import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userNotifications, notifications } from '@/lib/db/schema';
import { getUserId } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';

// GET: Get user's notifications
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserId();

        const userNotifs = await db.select({
            id: userNotifications.id,
            read: userNotifications.read,
            readAt: userNotifications.readAt,
            createdAt: userNotifications.createdAt,
            notificationId: notifications.id,
            title: notifications.title,
            body: notifications.body,
            imageUrl: notifications.imageUrl,
            actionUrl: notifications.actionUrl,
            sentAt: notifications.sentAt,
        })
        .from(userNotifications)
        .innerJoin(notifications, eq(userNotifications.notificationId, notifications.id))
        .where(eq(userNotifications.userId, userId))
        .orderBy(desc(userNotifications.createdAt));

        return NextResponse.json({
            success: true,
            notifications: userNotifs,
        });
    } catch (error: any) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT: Mark notification as read
export async function PUT(request: NextRequest) {
    try {
        const userId = await getUserId();
        const { notificationId } = await request.json();

        if (!notificationId) {
            return NextResponse.json(
                { error: 'Notification ID is required' },
                { status: 400 }
            );
        }

        await db.update(userNotifications)
            .set({ read: 1, readAt: new Date() })
            .where(
                and(
                    eq(userNotifications.userId, userId),
                    eq(userNotifications.notificationId, notificationId)
                )
            );

        return NextResponse.json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error: any) {
        console.error('Mark notification as read error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
