import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workoutLogs } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function GET() {
    try {
        const userId = await getUserId();

        // Get all workout logs for the user
        const allWorkouts = await db
            .select()
            .from(workoutLogs)
            .where(eq(workoutLogs.userId, userId));

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get unique workout dates
        const workoutDatesSet = new Set<string>();
        allWorkouts.forEach(workout => {
            const date = new Date(workout.timestamp);
            date.setHours(0, 0, 0, 0);
            workoutDatesSet.add(date.toISOString().split('T')[0]);
        });

        const workoutDatesArray = Array.from(workoutDatesSet).sort().reverse();

        // Calculate streak
        let checkDate = new Date(today);
        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (workoutDatesSet.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (i === 0) {
                // If no workout today, check yesterday
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Calculate monthly workouts (current month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyWorkouts = workoutDatesArray.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= startOfMonth;
        }).length;

        // Calculate consistency percentage for the month
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysPassed = today.getDate();
        const consistencyPercentage = Math.round((monthlyWorkouts / daysPassed) * 100);

        const stats = {
            currentStreak,
            monthlyWorkouts,
            consistencyPercentage: Math.min(consistencyPercentage, 100),
            totalWorkouts: allWorkouts.length,
            workoutDates: workoutDatesArray,
        };

        return NextResponse.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch statistics', error: error.message }, { status: 500 });
    }
}
