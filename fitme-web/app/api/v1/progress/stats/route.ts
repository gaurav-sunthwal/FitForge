import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workoutLogs } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function GET() {
    try {
        const userId = await getUserId();
        const totalWorkoutsResult = await db.select({ value: count() })
            .from(workoutLogs)
            .where(eq(workoutLogs.userId, userId));

        const stats = {
            currentStreak: 0, // Would need more logic to calculate streak
            consistencyPercentage: 100,
            totalWorkouts: totalWorkoutsResult[0].value || 0,
            monthlyMilestones: [
                { month: new Date().toLocaleString('default', { month: 'long' }), workoutsCompleted: totalWorkoutsResult[0].value, goalAchieved: true }
            ]
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
