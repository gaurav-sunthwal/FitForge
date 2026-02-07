import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foodLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ foodId: string }> }
) {
    try {
        const { foodId } = await params;
        const userId = await getUserId();

        await db.delete(foodLogs).where(
            and(
                eq(foodLogs.id, foodId),
                eq(foodLogs.userId, userId)
            )
        );

        return NextResponse.json({
            success: true,
            message: `Food item removed successfully`
        });
    } catch (error: any) {
        console.error('Error deleting food item:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete food item', error: error.message }, { status: 500 });
    }
}
