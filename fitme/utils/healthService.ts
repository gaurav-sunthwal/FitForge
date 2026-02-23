import { Platform } from 'react-native';

// Use more robust requiring for native modules
let AppleHealthKit: any = null;
let GoogleFit: any = null;
let Scopes: any = {};

try {
    if (Platform.OS === 'ios') {
        const Health = require('react-native-health');
        AppleHealthKit = Health.default || Health;
    } else if (Platform.OS === 'android') {
        const GF = require('react-native-google-fit');
        GoogleFit = GF.default || GF;
        Scopes = GF.Scopes || {};
    }
} catch (e) {
    console.warn('[HealthService] Native Health modules not available:', e);
}

export interface HealthData {
    steps: number;
    calories: number;
    lastUpdated: Date;
}

export class HealthService {
    private static isInitialized = false;

    static async authorize(): Promise<boolean> {
        try {
            if (Platform.OS === 'ios') {
                return new Promise((resolve) => {
                    if (!AppleHealthKit || typeof AppleHealthKit.initHealthKit !== 'function') {
                        console.warn('[HealthService] AppleHealthKit not available');
                        return resolve(false);
                    }

                    const P = AppleHealthKit.Constants?.Permissions;
                    const readPermissions = P ? [P.Steps, P.StepCount, P.ActiveEnergyBurned, P.BasalEnergyBurned].filter(Boolean) : ['Steps', 'StepCount', 'ActiveEnergyBurned', 'BasalEnergyBurned'];

                    const permissions = {
                        permissions: {
                            read: readPermissions,
                            write: [],
                        },
                    };

                    console.log('[HealthService] Triggering iOS Permission Prompt with:', permissions);
                    AppleHealthKit.initHealthKit(permissions, (error: string) => {
                        console.log('[HealthService] iOS Init Callback received, error:', error);
                        if (error) {
                            console.error('[HealthService] iOS Init Error:', error);
                            return resolve(false);
                        }
                        this.isInitialized = true;
                        resolve(true);
                    });
                });
            } else if (Platform.OS === 'android') {
                if (!GoogleFit || typeof GoogleFit.authorize !== 'function') {
                    console.warn('[HealthService] GoogleFit not available');
                    return false;
                }

                // Use a safer check that doesn't rely on internal 'isAuthorized' property if possible
                try {
                    const options = {
                        scopes: [
                            'https://www.googleapis.com/auth/fitness.activity.read',
                            'https://www.googleapis.com/auth/fitness.body.read',
                        ],
                    };

                    const result = await GoogleFit.authorize(options);
                    if (result && result.success) {
                        this.isInitialized = true;
                        return true;
                    }
                    return false;
                } catch (innerError) {
                    console.error('[HealthService] Android Inner Auth Error:', innerError);
                    return false;
                }
            }
        } catch (error) {
            console.error('[HealthService] Authorize Exception:', error);
            return false;
        }
        return false;
    }

    static async getTodayData(): Promise<HealthData | null> {
        if (!this.isInitialized) {
            const authorized = await this.authorize();
            if (!authorized) return null;
        }

        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

            let steps = 0;
            let calories = 0;

            if (Platform.OS === 'ios') {
                const options = {
                    date: startOfDay,
                };

                const getSteps = (): Promise<number> => new Promise((resolve) => {
                    AppleHealthKit.getStepCount(options, (err: Object, results: { value: number }) => {
                        if (err || !results) resolve(0);
                        else resolve(results.value);
                    });
                });

                const getCalories = (): Promise<number> => new Promise((resolve) => {
                    AppleHealthKit.getActiveEnergyBurned(options, (err: Object, results: { value: number }[]) => {
                        if (err || !results || results.length === 0) resolve(0);
                        else resolve(results[0].value);
                    });
                });

                [steps, calories] = await Promise.all([getSteps(), getCalories()]);
            } else {
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                const end = new Date();

                const results = await GoogleFit.getDailySteps(start, end);
                if (results && results.length > 0) {
                    const todayData = results.find((r: any) => r.source === 'com.google.android.gms:estimated_steps');
                    if (todayData && todayData.steps && todayData.steps.length > 0) {
                        steps = todayData.steps[0].value;
                    }
                }

                const cals = await GoogleFit.getDailyCalorieSamples({
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                });
                if (cals && cals.length > 0) {
                    calories = Math.round(cals.reduce((acc: number, curr: any) => acc + (curr.calorie || 0), 0));
                }
            }

            return {
                steps,
                calories,
                lastUpdated: new Date(),
            };
        } catch (error) {
            console.error('[HealthService] Fetch Error:', error);
            return null;
        }
    }
}
