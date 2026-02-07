import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workoutLogs } from '@/lib/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, workoutType, workoutName, durationMinutes, duration, caloriesBurned } = body;
        const userId = await getUserId();

        const logDate = date ? new Date(date) : new Date();

        const [newLog] = await db.insert(workoutLogs).values({
            userId: userId,
            workoutName: workoutName || workoutType || 'General Workout',
            duration: duration || durationMinutes || 0,
            caloriesBurned: caloriesBurned || 0,
            timestamp: logDate,
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'Workout recorded! Keep up the streak.',
            data: newLog
        });
    } catch (error: any) {
        console.error('Error logging workout:', error);
        return NextResponse.json({ success: false, message: 'Failed to record workout', error: error.message }, { status: 500 });
    }
}
