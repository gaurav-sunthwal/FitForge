import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fitme-forge-secret-key-123456';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-987654';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find admin by email
        const admin = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

        if (admin.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, admin[0].password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin[0].id, email: admin[0].email },
            ADMIN_JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            success: true,
            token,
            admin: {
                id: admin[0].id,
                name: admin[0].name,
                email: admin[0].email,
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
