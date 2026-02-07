import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foodLogs, waterLogs, userGoals } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
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

        // Fetch food logs for the date using select
        const dailyFood = await db
            .select()
            .from(foodLogs)
            .where(
                and(
                    eq(foodLogs.userId, userId),
                    gte(foodLogs.timestamp, startOfDay),
                    lte(foodLogs.timestamp, endOfDay)
                )
            );

        // Fetch water logs for the date using select
        const dailyWater = await db
            .select()
            .from(waterLogs)
            .where(
                and(
                    eq(waterLogs.userId, userId),
                    gte(waterLogs.timestamp, startOfDay),
                    lte(waterLogs.timestamp, endOfDay)
                )
            );

        // Fetch user goals using select
        const goalsResult = await db
            .select()
            .from(userGoals)
            .where(eq(userGoals.userId, userId))
            .limit(1);

        const goals = goalsResult[0];

        // Calculate totals
        const totalCalories = dailyFood.reduce((sum, item) => sum + item.calories, 0);
        const totalProtein = dailyFood.reduce((sum, item) => sum + (item.protein || 0), 0);
        const totalCarbs = dailyFood.reduce((sum, item) => sum + (item.carbs || 0), 0);
        const totalFats = dailyFood.reduce((sum, item) => sum + (item.fats || 0), 0);
        const totalWater = dailyWater.reduce((sum, item) => sum + item.amount, 0);

        const responseData = {
            foodLogs: dailyFood.map(item => ({
                id: item.id,
                foodName: item.foodName,
                calories: item.calories,
                protein: item.protein || 0,
                carbs: item.carbs || 0,
                fats: item.fats || 0,
                timestamp: item.timestamp.toISOString()
            })),
            waterLogs: dailyWater.map(item => ({
                id: item.id,
                amount: item.amount,
                timestamp: item.timestamp.toISOString()
            })),
            stats: {
                totalCalories,
                totalProtein,
                totalCarbs,
                totalFats,
                totalWater,
                calorieTarget: goals?.calorieTarget || 2000,
                proteinTarget: goals?.proteinTarget || 150,
                carbsTarget: goals?.carbsTarget || 200,
                fatsTarget: goals?.fatsTarget || 65,
                waterTarget: goals?.waterTarget || 8,
            }
        };

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error: any) {
        console.error('Error fetching nutrition data:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch nutrition data', error: error.message }, { status: 500 });
    }
}
