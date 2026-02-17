import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, secretKey } = await request.json();

        // Check if setup secret key matches (for initial admin creation)
        const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'setup-admin-2026';
        
        if (secretKey !== SETUP_SECRET) {
            return NextResponse.json(
                { error: 'Invalid setup secret key' },
                { status: 403 }
            );
        }

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = await db.insert(admins).values({
            email,
            password: hashedPassword,
            name,
        }).returning();

        return NextResponse.json({
            success: true,
            admin: {
                id: newAdmin[0].id,
                name: newAdmin[0].name,
                email: newAdmin[0].email,
            },
        });
    } catch (error: any) {
        console.error('Admin registration error:', error);
        
        if (error.code === '23505') { // Unique constraint violation
            return NextResponse.json(
                { error: 'Admin with this email already exists' },
                { status: 409 }
            );
        }
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
