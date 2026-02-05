import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foodLogs } from '@/lib/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { foodName, calories, protein, carbs, fats, timestamp } = body;
        const userId = await getUserId();

        if (!foodName || calories === undefined) {
            return NextResponse.json({ success: false, message: 'foodName and calories are required' }, { status: 400 });
        }

        const logDate = timestamp ? new Date(timestamp) : new Date();

        const [newLog] = await db.insert(foodLogs).values({
            userId: userId,
            foodName,
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fats: fats || 0,
            timestamp: logDate,
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'Food item added to log',
            data: newLog
        });
    } catch (error: any) {
        console.error('Error logging food:', error);
        return NextResponse.json({ success: false, message: 'Failed to log food', error: error.message }, { status: 500 });
    }
}
