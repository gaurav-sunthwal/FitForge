import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fitme-forge-secret-key-123456';

export async function getUserId() {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Fallback to x-user-id for temporary transition, but warn or restrict later
        const userId = headersList.get('x-user-id');
        if (userId) return userId;

        throw new Error('Unauthorized: No authentication token provided');
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        throw new Error('Unauthorized: Invalid or expired token');
    }
}
