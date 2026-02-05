import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, age, height, gender, weight, profileImage } = body;
        const userId = await getUserId();

        // Ensure user exists
        await db.insert(users).values({
            id: userId,
            email: email || 'test@example.com',
            name: name,
            imageUrl: profileImage,
        }).onConflictDoUpdate({
            target: users.id,
            set: {
                name: name,
                imageUrl: profileImage,
                updatedAt: new Date(),
            }
        });

        // Update profile
        await db.insert(userProfiles).values({
            userId: userId,
            age: age,
            height: height,
            gender: gender,
            weight: weight,
        }).onConflictDoUpdate({
            target: userProfiles.userId,
            set: {
                age: age,
                height: height,
                gender: gender,
                weight: weight,
                updatedAt: new Date(),
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: { name, email, age, height, gender, weight, profileImage }
        });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ success: false, message: 'Failed to update profile', error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const userId = await getUserId();
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                profile: true,
            }
        });

        return NextResponse.json({
            success: true,
            data: user
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    return POST(request);
}
