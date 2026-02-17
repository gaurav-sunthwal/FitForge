import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, userNotifications, deviceTokens, users } from '@/lib/db/schema';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

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

// Send push notification using Expo
async function sendPushNotification(expoPushToken: string, title: string, body: string, data?: any) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error sending push notification:', error);
        return null;
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

        // Send push notifications to all devices
        let sentCount = 0;
        const pushNotificationPromises = allDeviceTokens.map(async (device) => {
            const result = await sendPushNotification(
                device.token,
                title,
                body,
                { notificationId, actionUrl }
            );
            if (result) sentCount++;
        });

        await Promise.all(pushNotificationPromises);

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
