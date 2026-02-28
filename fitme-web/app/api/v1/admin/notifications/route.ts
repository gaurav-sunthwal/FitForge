import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, userNotifications, deviceTokens, users } from '@/lib/db/schema';
import jwt from 'jsonwebtoken';
import { eq, inArray } from 'drizzle-orm';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-987654';
const EXPO_ACCESS_TOKEN = process.env.EXPO_ACCESS_TOKEN;

function verifyAdminToken(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized: No admin token provided');
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string; email: string };
        return decoded.adminId;
    } catch (error) {
        console.error('Admin JWT Verification Error:', error);
        throw new Error('Unauthorized: Invalid or expired admin token');
    }
}

// Send push notifications in batch using Expo Push API
async function sendPushNotifications(
    tokens: { id: string; token: string }[],
    title: string,
    body: string,
    data?: any
): Promise<{ sentCount: number; invalidTokenIds: string[] }> {
    if (tokens.length === 0) return { sentCount: 0, invalidTokenIds: [] };

    const messages = tokens.map(({ token }) => ({
        to: token,
        sound: 'default',
        title,
        body,
        data: data || {},
        priority: 'high',
        channelId: 'default', // Required for Android
    }));

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
    };

    // Include the Expo Access Token if available — required for production delivery
    const expoAccessToken = process.env.EXPO_ACCESS_TOKEN;
    if (expoAccessToken) {
        headers['Authorization'] = `Bearer ${expoAccessToken}`;
    } else {
        console.warn('⚠️ EXPO_ACCESS_TOKEN is not set. Push notifications may be rate-limited in production.');
    }

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers,
            body: JSON.stringify(messages),
        });

        if (!response.ok) {
            console.error('Expo push API returned error:', response.status, await response.text());
            return { sentCount: 0, invalidTokenIds: [] };
        }

        const result = await response.json();
        // result.data is an array of ticket objects, one per message sent
        const tickets: any[] = result?.data || [];

        let sentCount = 0;
        const invalidTokenIds: string[] = [];

        tickets.forEach((ticket, index) => {
            if (ticket.status === 'ok') {
                sentCount++;
            } else if (ticket.status === 'error') {
                const details = ticket.details || {};
                // DeviceNotRegistered means the token is stale/invalid — remove it
                if (details.error === 'DeviceNotRegistered' || details.error === 'InvalidCredentials') {
                    invalidTokenIds.push(tokens[index].id);
                    console.log(`Removing stale token for device: ${tokens[index].id}`);
                } else {
                    console.error(`Push failed for token ${tokens[index].token}:`, ticket.message, details);
                }
            }
        });

        return { sentCount, invalidTokenIds };
    } catch (error) {
        console.error('Error sending push notifications:', error);
        return { sentCount: 0, invalidTokenIds: [] };
    }
}

// POST: Create and send notification to all users
export async function POST(request: NextRequest) {
    try {
        const adminId = verifyAdminToken(request);
        const { title, body, imageUrl, actionUrl } = await request.json();

        if (!title || !body) {
            return NextResponse.json(
                { error: 'Title and body are required' },
                { status: 400 }
            );
        }

        // Create notification record
        const newNotification = await db.insert(notifications).values({
            title,
            body,
            imageUrl: imageUrl || null,
            actionUrl: actionUrl || null,
            sentBy: adminId,
            status: 'sent',
        }).returning();

        const notificationId = newNotification[0].id;

        // Get all users
        const allUsers = await db.select({
            id: users.id,
        }).from(users);

        // Get all device tokens
        const allDeviceTokens = await db.select().from(deviceTokens);

        // Create user notification records
        const userNotificationPromises = allUsers.map((user) =>
            db.insert(userNotifications).values({
                userId: user.id,
                notificationId,
                read: 0,
            })
        );

        await Promise.all(userNotificationPromises);

        // Send push notifications to all devices in batch
        const tokenList = allDeviceTokens.map((d) => ({ id: d.id, token: d.token }));
        const { sentCount, invalidTokenIds } = await sendPushNotifications(
            tokenList,
            title,
            body,
            { notificationId, actionUrl }
        );

        // Clean up stale/invalid device tokens
        if (invalidTokenIds.length > 0) {
            await db.delete(deviceTokens).where(inArray(deviceTokens.id, invalidTokenIds));
            console.log(`Removed ${invalidTokenIds.length} stale device token(s).`);
        }

        // Update recipient count
        await db.update(notifications)
            .set({ recipientCount: allUsers.length })
            .where(eq(notifications.id, notificationId));

        return NextResponse.json({
            success: true,
            notification: newNotification[0],
            recipientCount: allUsers.length,
            pushNotificationsSent: sentCount,
        });
    } catch (error: any) {
        console.error('Notification creation error:', error);

        if (error.message && error.message.includes('Unauthorized')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: Get all notifications (admin view)
export async function GET(request: NextRequest) {
    try {
        const adminId = verifyAdminToken(request);

        const allNotifications = await db.select().from(notifications).orderBy(notifications.sentAt);

        return NextResponse.json({
            success: true,
            notifications: allNotifications,
        });
    } catch (error: any) {
        console.error('Fetch notifications error:', error);

        if (error.message && error.message.includes('Unauthorized')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
// DELETE: Delete a past notification
export async function DELETE(request: NextRequest) {
    try {
        const adminId = verifyAdminToken(request);
        const { searchParams } = new URL(request.url);
        const notificationId = searchParams.get('id');

        if (!notificationId) {
            return NextResponse.json(
                { error: 'Notification ID is required' },
                { status: 400 }
            );
        }

        // 1. Delete user notifications first
        await db.delete(userNotifications).where(eq(userNotifications.notificationId, notificationId));

        // 2. Delete the main notification
        const result = await db.delete(notifications)
            .where(eq(notifications.id, notificationId))
            .returning();

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete notification error:', error);

        if (error.message && error.message.includes('Unauthorized')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
