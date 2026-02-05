import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waterLogs } from '@/lib/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { count, amount, timestamp } = body;
        const userId = await getUserId();
        const waterAmount = amount ?? count;

        if (waterAmount === undefined) {
            return NextResponse.json({ success: false, message: 'amount or count is required' }, { status: 400 });
        }

        const logDate = timestamp ? new Date(timestamp) : new Date();

        const [newLog] = await db.insert(waterLogs).values({
            userId: userId,
            amount: waterAmount,
            timestamp: logDate,
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'Water count updated successfully',
            data: newLog
        });
    } catch (error: any) {
        console.error('Error logging water:', error);
        return NextResponse.json({ success: false, message: 'Failed to log water', error: error.message }, { status: 500 });
    }
}
