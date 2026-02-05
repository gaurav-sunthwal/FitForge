import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foodLogs, waterLogs, userGoals } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ date: string }> }
) {
    try {
        const { date } = await params;
        const userId = await getUserId();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch food logs for the date
        const dailyFood = await db.query.foodLogs.findMany({
            where: and(
                eq(foodLogs.userId, userId),
                sql`${foodLogs.timestamp} >= ${startOfDay} AND ${foodLogs.timestamp} <= ${endOfDay}`
            ),
        });

        // Fetch water logs for the date
        const dailyWater = await db.query.waterLogs.findMany({
            where: and(
                eq(waterLogs.userId, userId),
                sql`${waterLogs.timestamp} >= ${startOfDay} AND ${waterLogs.timestamp} <= ${endOfDay}`
            ),
        });

        // Fetch user goals
        const goals = await db.query.userGoals.findFirst({
            where: eq(userGoals.userId, userId),
        });

        const caloriesConsumed = dailyFood.reduce((sum, item) => sum + item.calories, 0);
        const waterCount = dailyWater.reduce((sum, item) => sum + item.amount, 0);

        const dailyProgress = {
            date,
            caloriesConsumed,
            calorieTarget: goals?.calorieTarget || 2200,
            waterCount,
            waterTarget: goals?.waterTarget || 8,
            foodItems: dailyFood.map(item => ({
                id: item.id,
                foodName: item.foodName,
                calories: item.calories,
                protein: item.protein,
                timestamp: item.timestamp.toISOString()
            }))
        };

        return NextResponse.json({
            success: true,
            data: dailyProgress
        });
    } catch (error: any) {
        console.error('Error fetching nutrition data:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch nutrition data', error: error.message }, { status: 500 });
    }
}
