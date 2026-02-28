import AsyncStorage from '@react-native-async-storage/async-storage';

// export const BASE_URL = 'http://10.130.2.241:3000/api/v1';
// export const BASE_URL = 'http://localhost:3000/api/v1';
export const BASE_URL = 'https://fitme-gaurav.vercel.app/api/v1';


async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const [userId, token] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userToken')
    ]);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Fallback for transition
    if (userId) {
        headers['x-user-id'] = userId;
    }

    const response = await fetch(url, {
        headers,
        ...options,
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'API request failed');
    }
    return result;
}

export const api = {
    // Auth APIs
    auth: {
        login: (email: string, password: string) => request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
        register: (data: { email: string, name: string, password: string }) => request<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // User APIs
    user: {
        getProfile: () => request<any>('/user/profile'),
        updateProfile: (data: any) => request<any>('/user/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getGoals: () => request<any>('/user/goals'),
        updateGoals: (data: any) => request<any>('/user/goals', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        updateSettings: (data: any) => request<any>('/user/settings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Nutrition APIs
    nutrition: {
        getDaily: (date: string) => request<any>(`/nutrition/daily/${date}`),
        logFood: (data: any) => request<any>('/nutrition/log', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        deleteFood: (foodId: string) => request<any>(`/nutrition/log/${foodId}`, {
            method: 'DELETE',
        }),
        logWater: (amount: number, timestamp?: string) => request<any>('/nutrition/water', {
            method: 'POST',
            body: JSON.stringify({ amount, timestamp }),
        }),
    },

    // Progress APIs
    progress: {
        getStats: () => request<any>('/progress/stats'),
        getAnalytics: (timeRange: 'week' | 'month' | '3months') => request<any>(`/progress/analytics?range=${timeRange}`),
        completeWorkout: (data: any) => request<any>('/progress/workout-complete', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        uploadPhoto: (imageUrl: string, caption?: string) => request<any>('/progress/photo', {
            method: 'POST',
            body: JSON.stringify({ imageUrl, caption }),
        }),
    },

    // AI APIs
    ai: {
        analyzeMeal: (imageBase64: string) => request<any>('/ai/analyze-meal', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 }),
        }),
        analyzeFoodByName: (foodName: string) => request<any>('/ai/analyze-meal', {
            method: 'POST',
            body: JSON.stringify({ foodName }),
        }),
        validateGymImage: (imageBase64: string) => request<any>('/ai/analyze-meal', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64, validateGymImage: true }),
        }),
        testApiKey: (apiKey: string) => request<any>('/ai/test-key', {
            method: 'POST',
            body: JSON.stringify({ apiKey }),
        }),
        getWorkoutPlan: () => request<any>('/ai/workout-plan'),
        generateWeeklyPlan: () => request<any>('/ai/generate-weekly-plan', {
            method: 'POST'
        }),
        updateApiKey: (apiKey: string) => request<any>('/user/api-key', {
            method: 'POST',
            body: JSON.stringify({ apiKey }),
        }),
    },
    // Invitation APIs
    invitations: {
        create: (referrerId: string, inviteCode?: string) => request<any>('/invitations', {
            method: 'POST',
            body: JSON.stringify({ referrerId, inviteCode }),
        }),
    },
};
