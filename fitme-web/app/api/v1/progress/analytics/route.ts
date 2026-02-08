import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foodLogs, waterLogs, workoutLogs, userGoals } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const userId = await getUserId();
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'week';

        // Calculate date range
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        if (range === 'week') {
            startDate.setDate(endDate.getDate() - 6); // Last 7 days
        } else if (range === 'month') {
            startDate.setDate(endDate.getDate() - 29); // Last 30 days
        } else if (range === '3months') {
            startDate.setDate(endDate.getDate() - 89); // Last 90 days
        }

        // Fetch user goals
        const goalsResult = await db
            .select()
            .from(userGoals)
            .where(eq(userGoals.userId, userId))
            .limit(1);

        const goals = goalsResult[0] || {
            calorieTarget: 2000,
            proteinTarget: 150,
            waterTarget: 8,
        };

        // Fetch food logs
        const foodData = await db
            .select()
            .from(foodLogs)
            .where(
                and(
                    eq(foodLogs.userId, userId),
                    gte(foodLogs.timestamp, startDate)
                )
            )
            .orderBy(foodLogs.timestamp);

        // Fetch water logs
        const waterData = await db
            .select()
            .from(waterLogs)
            .where(
                and(
                    eq(waterLogs.userId, userId),
                    gte(waterLogs.timestamp, startDate)
                )
            )
            .orderBy(waterLogs.timestamp);

        // Fetch workout logs
        const workoutData = await db
            .select()
            .from(workoutLogs)
            .where(
                and(
                    eq(workoutLogs.userId, userId),
                    gte(workoutLogs.timestamp, startDate)
                )
            )
            .orderBy(workoutLogs.timestamp);

        // Process data by day
        const daysCount = range === 'week' ? 7 : range === 'month' ? 30 : 90;
        const dailyData: { [key: string]: any } = {};

        // Initialize all days
        for (let i = 0; i < daysCount; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateKey = date.toISOString().split('T')[0];

            dailyData[dateKey] = {
                calories: 0,
                protein: 0,
                water: 0,
                workoutCount: 0,
                caloriesBurned: 0,
            };
        }

        // Aggregate food data
        foodData.forEach((food) => {
            const dateKey = food.timestamp.toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].calories += food.calories;
                dailyData[dateKey].protein += food.protein || 0;
            }
        });

        // Aggregate water data
        waterData.forEach((water) => {
            const dateKey = water.timestamp.toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].water += water.amount;
            }
        });

        // Aggregate workout data
        workoutData.forEach((workout) => {
            const dateKey = workout.timestamp.toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].workoutCount += 1;
                dailyData[dateKey].caloriesBurned += workout.caloriesBurned || 0;
            }
        });

        // Convert to arrays for charts
        const sortedDates = Object.keys(dailyData).sort();
        const caloriesTrend = sortedDates.map(date => dailyData[date].calories);
        const proteinTrend = sortedDates.map(date => dailyData[date].protein);
        const waterTrend = sortedDates.map(date => dailyData[date].water);
        const workoutDays = sortedDates.map(date => dailyData[date].workoutCount > 0 ? 1 : 0);
        const caloriesBurned = sortedDates.map(date => dailyData[date].caloriesBurned);

        // Generate labels based on range
        let labels: string[] = [];
        if (range === 'week') {
            labels = sortedDates.map(date => {
                const d = new Date(date);
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
            });
        } else if (range === 'month') {
            labels = sortedDates.filter((_, i) => i % 5 === 0).map(date => {
                const d = new Date(date);
                return `${d.getDate()}`;
            });
        } else {
            labels = sortedDates.filter((_, i) => i % 15 === 0).map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            });
        }

        // Calculate averages
        const totalDays = sortedDates.length;
        const avgCalories = Math.round(caloriesTrend.reduce((a, b) => a + b, 0) / totalDays);
        const avgProtein = Math.round(proteinTrend.reduce((a, b) => a + b, 0) / totalDays);
        const avgWater = Math.round(waterTrend.reduce((a, b) => a + b, 0) / totalDays);
        const totalWorkouts = workoutDays.filter(d => d === 1).length;

        const responseData = {
            caloriesTrend,
            proteinTrend,
            waterTrend,
            workoutDays,
            caloriesBurned,
            labels,
            averages: {
                calories: avgCalories,
                protein: avgProtein,
                water: avgWater,
                workouts: totalWorkouts,
            },
            goals: {
                calories: goals.calorieTarget || 2000,
                protein: goals.proteinTarget || 150,
                water: goals.waterTarget || 8,
            },
        };

        return NextResponse.json({
            success: true,
            data: responseData,
        });
    } catch (error: any) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch analytics',
                error: error.message
            },
            { status: 500 }
        );
    }
}
