import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workoutPlans } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const userId = await getUserId();

        // Fetch saved workout plan
        const savedPlan = await db.query.workoutPlans.findFirst({
            where: eq(workoutPlans.userId, userId),
        });

        if (!savedPlan) {
            return NextResponse.json({
                success: false,
                message: 'No workout plan found. Please generate one in settings.',
                noPlan: true
            });
        }

        const fullPlan = JSON.parse(savedPlan.plan);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];

        const todayPlan = fullPlan.weekPlan ? fullPlan.weekPlan[today] : fullPlan[today];

        if (!todayPlan) {
            return NextResponse.json({ success: false, message: 'Today\'s plan not found in weekly schedule' });
        }

        // Check if it's a rest day
        if (todayPlan.target === "Rest Day" || (todayPlan.exercises && todayPlan.exercises.length === 0)) {
            return NextResponse.json({
                success: true,
                data: {
                    isRestDay: true,
                    targetMuscles: "Rest Day",
                    workoutName: "Recover & Refuel",
                    exercises: [],
                    motivationalMessage: "Rest is just as important as the workout. Let your muscles recover today!"
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                targetMuscles: todayPlan.target || todayPlan.targetMuscles,
                workoutName: todayPlan.workoutName || todayPlan.target || "Daily Workout",
                exercises: todayPlan.exercises || [],
                motivationalMessage: todayPlan.motivationalMessage || "Keep going!"
            }
        });

    } catch (error: any) {
        console.error('Workout Plan Fetch Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch workout plan',
            error: error.message
        }, { status: 500 });
    }
}
