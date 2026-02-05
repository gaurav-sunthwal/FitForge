import { headers } from 'next/headers';
import { TEST_USER_ID } from './constants';

export async function getUserId() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    return userId || TEST_USER_ID;
}
