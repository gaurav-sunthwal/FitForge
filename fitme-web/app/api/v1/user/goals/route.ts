import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGoals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { currentWeight, calorieTarget, proteinTarget, carbsTarget, fatsTarget, waterTarget } = body;
        const userId = await getUserId();

        // Update goals
        await db.insert(userGoals).values({
            userId: userId,
            calorieTarget: calorieTarget,
            proteinTarget: proteinTarget,
            carbsTarget: carbsTarget,
            fatsTarget: fatsTarget,
            waterTarget: waterTarget,
        }).onConflictDoUpdate({
            target: userGoals.userId,
            set: {
                calorieTarget: calorieTarget,
                proteinTarget: proteinTarget,
                carbsTarget: carbsTarget,
                fatsTarget: fatsTarget,
                waterTarget: waterTarget,
                updatedAt: new Date(),
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Fitness goals updated successfully',
            data: body
        });
    } catch (error: any) {
        console.error('Error updating goals:', error);
        return NextResponse.json({ success: false, message: 'Failed to update goals', error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const userId = await getUserId();
        const goals = await db.query.userGoals.findFirst({
            where: eq(userGoals.userId, userId),
        });

        return NextResponse.json({
            success: true,
            data: goals
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Failed to fetch goals' }, { status: 500 });
    }
}
