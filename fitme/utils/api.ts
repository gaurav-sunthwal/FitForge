import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://localhost:3000/api/v1';
// export const BASE_URL = 'http://localhost:3000/api/v1';
// export const BASE_URL = 'http://172.28.194.241:3000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const userId = await AsyncStorage.getItem('userId');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

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
        login: (email: string) => request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),
        register: (data: { email: string, name: string }) => request<any>('/auth/register', {
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
        logWater: (amount: number) => request<any>('/nutrition/water', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        }),
    },

    // Progress APIs
    progress: {
        getStats: () => request<any>('/progress/stats'),
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
    },
};
