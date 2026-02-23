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

        // Helper to get YYYY-MM-DD in local time
        const today = new Date();
        const getLocalDateString = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Get unique workout dates
        const workoutDatesSet = new Set<string>();
        allWorkouts.forEach(workout => {
            const date = new Date(workout.timestamp);
            workoutDatesSet.add(getLocalDateString(date));
        });

        const workoutDatesArray = Array.from(workoutDatesSet).sort().reverse();

        // Calculate streak
        let currentStreak = 0;
        let checkDate = new Date(today);

        // Loop to check consecutive days
        // We start checking from TODAY. If today has a workout, streak++ and check yesterday.
        // If today has NO workout, we allow the streak to continue from yesterday (streak isn't broken yet if I haven't worked out TODAY).
        // But the previous implementation had a specific check for i==0.

        // Revised logic:
        // Check today. 
        // If yes -> streak++, check yesterday.
        // If no -> check yesterday. If yesterday yes -> streak++, check day before. If yesterday no -> streak broken (0).

        // Actually, typical streak logic:
        // Count consecutive days going back from today.
        // Special case: if I haven't done today's workout yet, my streak is the count ending yesterday.
        // If I HAVE done today's workout, my streak includes today.

        const todayStr = getLocalDateString(today);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);

        if (workoutDatesSet.has(todayStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1); // Next check is yesterday
        } else if (workoutDatesSet.has(yesterdayStr)) {
            // No workout today, but kept streak alive yesterday
            // Streak doesn't increment for today, but we start counting backwards from yesterday
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // No workout today OR yesterday (broken streak)
            // But wait, if I have 0 streak, currentStreak stays 0.
        }

        // Now loop backwards from checkDate
        // We already handled "start point", now just count backwards as long as we find workouts
        // But wait, the loop structure I'm replacing was a bit different. Let's simpler loop.

        // Reset checkDate to start checking from wherever we decided "the chain continues"
        // If today matches, we continue from yesterday.
        // If today misses but yesterday matches, we continue from yesterday.
        // If neither, streak is 0.

        // Actually, simpler approach:
        // 1. Check if today is present. If yes, streak = 1, lastMatched = today.
        // 2. If no, check if yesterday is present. If yes, streak = 1, lastMatched = yesterday.
        // 3. If neither, streak = 0.
        // 4. Then loop backwards from (lastMatched - 1 day).

        let lastMatchedDate: Date | null = null;
        if (workoutDatesSet.has(todayStr)) {
            currentStreak = 1;
            lastMatchedDate = new Date(today);
        } else if (workoutDatesSet.has(yesterdayStr)) {
            currentStreak = 0; // Don't count "yesterday" yet, let the loop do it to be consistent, or start with 0 and let loop handle?
            // Actually, if yesterday is present, it's a valid streak of at least 1 (?)
            // Usually "Current Streak" includes yesterday if today isn't done.
            lastMatchedDate = new Date(today); // Start checking from yesterday in the loop
            // checkDate is already today.
        }

        // Let's stick to the original logic structure but with fixed dates, it was likely trying to do:
        checkDate = new Date(today); // Reset to today

        for (let i = 0; i < 365; i++) {
            const dateStr = getLocalDateString(checkDate);

            if (workoutDatesSet.has(dateStr)) {
                if (i === 0) {
                    currentStreak++; // Today matched
                } else {
                    currentStreak++; // Past day matched
                }
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (i === 0) {
                // Today missing, but that's allowed. Don't break streak, just move to yesterday.
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // Break on any other missing day
                break;
            }
        }

        // Calculate monthly workouts (current month)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyWorkouts = workoutDatesArray.filter(dateStr => {
            const [y, m, d] = dateStr.split('-').map(Number);
            const date = new Date(y, m - 1, d); // Construct date safely
            return date >= startOfMonth;
        }).length;

        // Calculate consistency percentage for the month
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysPassed = today.getDate();
        const consistencyPercentage = Math.round((monthlyWorkouts / daysPassed) * 100);

        // Create a map of dates to workout details
        const workoutsByDate: { [key: string]: any } = {};
        allWorkouts.forEach(workout => {
            try {
                const dateStr = getLocalDateString(new Date(workout.timestamp));
                let parsedExercises = [];
                if (workout.exercises) {
                    if (typeof workout.exercises === 'string') {
                        try {
                            parsedExercises = JSON.parse(workout.exercises);
                        } catch (e) {
                            parsedExercises = [workout.exercises]; // Fallback if it's just a string but not JSON
                        }
                    } else if (Array.isArray(workout.exercises)) {
                        parsedExercises = workout.exercises;
                    }
                }

                workoutsByDate[dateStr] = {
                    workoutName: workout.workoutName,
                    duration: workout.duration,
                    caloriesBurned: workout.caloriesBurned,
                    exercises: Array.isArray(parsedExercises) ? parsedExercises : [],
                    timestamp: workout.timestamp
                };
            } catch (e) {
                console.error(`Error processing workout ${workout.id}:`, e);
            }
        });



        const stats = {
            currentStreak,
            monthlyWorkouts,
            consistencyPercentage: Math.min(consistencyPercentage, 100),
            totalWorkouts: allWorkouts.length,
            workoutDates: workoutDatesArray,
            workoutsByDate: workoutsByDate,
        };

        return NextResponse.json({
            success: true,
            data: stats
        });

    } catch (error: any) {
        console.error('CRITICAL: Error fetching stats:', error);
        console.error('Stack:', error.stack);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }

}
