import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        // Create user
        const newUser = await db.insert(users).values({
            email,
            name: name || email.split('@')[0],
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            data: newUser[0]
        });
    } catch (error: any) {
        console.error('Error during registration:', error);
        return NextResponse.json({ success: false, message: 'Failed to register', error: error.message }, { status: 500 });
    }
}
