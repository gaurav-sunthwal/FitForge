import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api';

// Configure how notifications should be handled when app is in foreground
// Note: Notifications scheduled with this service work in ALL app states:
// ✅ App is open (foreground) - shows with alert/sound/badge
// ✅ App is minimized (background) - OS handles automatically
// ✅ App is closed - OS handles automatically
// This is the default behavior for local scheduled notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationSettings {
    gymSelfieEnabled: boolean;
    gymSelfieTime: string; // Format: "HH:MM" (24-hour)
    mealReminderEnabled: boolean;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    waterReminderEnabled: boolean;
    waterReminderInterval: number; // in hours
}

const DEFAULT_SETTINGS: NotificationSettings = {
    gymSelfieEnabled: true,
    gymSelfieTime: "19:00", // 7 PM
    mealReminderEnabled: true,
    breakfastTime: "08:00",
    lunchTime: "13:00",
    dinnerTime: "20:00",
    waterReminderEnabled: true,
    waterReminderInterval: 2, // Every 2 hours
};

const STORAGE_KEY = 'notification_settings';
const NOTIFICATION_IDS_KEY = 'scheduled_notification_ids';

export class NotificationService {
    /**
     * Request notification permissions
     */
    static async requestPermissions(): Promise<boolean> {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return false;
        }

        // Configure Android channels for reliable notifications in all app states
        // These notifications will work even when app is closed/background
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                bypassDnd: false,
                showBadge: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            });

            await Notifications.setNotificationChannelAsync('gym-reminders', {
                name: 'Gym Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'default',
                bypassDnd: false,
                showBadge: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                enableLights: true,
                enableVibrate: true,
            });

            await Notifications.setNotificationChannelAsync('meal-reminders', {
                name: 'Meal Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'default',
                bypassDnd: false,
                showBadge: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                enableLights: true,
                enableVibrate: true,
            });

            await Notifications.setNotificationChannelAsync('water-reminders', {
                name: 'Water Reminders',
                importance: Notifications.AndroidImportance.DEFAULT,
                vibrationPattern: [0, 250],
                sound: 'default',
                bypassDnd: false,
                showBadge: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                enableLights: true,
                enableVibrate: true,
            });
        }

        return true;
    }

    /**
     * Get notification settings from storage
     */
    static async getSettings(): Promise<NotificationSettings> {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
        return DEFAULT_SETTINGS;
    }

    /**
     * Save notification settings
     */
    static async saveSettings(settings: NotificationSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            // Reschedule all notifications with new settings
            await this.scheduleAllNotifications(settings);
        } catch (error) {
            console.error('Error saving notification settings:', error);
            throw error;
        }
    }

    /**
     * Cancel all scheduled notifications
     */
    static async cancelAllNotifications(): Promise<void> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await AsyncStorage.removeItem(NOTIFICATION_IDS_KEY);
        } catch (error) {
            console.error('Error canceling notifications:', error);
        }
    }

    /**
     * Schedule all notifications based on settings
     */
    static async scheduleAllNotifications(settings?: NotificationSettings): Promise<void> {
        const notificationSettings = settings || await this.getSettings();
        
        // Cancel existing notifications first
        await this.cancelAllNotifications();

        const scheduledIds: string[] = [];

        // Schedule gym selfie reminder
        if (notificationSettings.gymSelfieEnabled) {
            const gymId = await this.scheduleGymSelfieReminder(notificationSettings.gymSelfieTime);
            if (gymId) scheduledIds.push(gymId);
        }

        // Schedule meal reminders
        if (notificationSettings.mealReminderEnabled) {
            const breakfastId = await this.scheduleMealReminder('breakfast', notificationSettings.breakfastTime);
            const lunchId = await this.scheduleMealReminder('lunch', notificationSettings.lunchTime);
            const dinnerId = await this.scheduleMealReminder('dinner', notificationSettings.dinnerTime);
            
            if (breakfastId) scheduledIds.push(breakfastId);
            if (lunchId) scheduledIds.push(lunchId);
            if (dinnerId) scheduledIds.push(dinnerId);
        }

        // Schedule water reminders
        if (notificationSettings.waterReminderEnabled) {
            const waterIds = await this.scheduleWaterReminders(notificationSettings.waterReminderInterval);
            scheduledIds.push(...waterIds);
        }

        // Save scheduled IDs
        await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(scheduledIds));
    }

    /**
     * Schedule gym selfie reminder
     */
    private static async scheduleGymSelfieReminder(time: string): Promise<string | null> {
        try {
            const [hours, minutes] = time.split(':').map(Number);
            
            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "💪 Time for Your Gym Selfie!",
                    body: "Don't forget to capture today's progress. Every day counts! 📸",
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    vibrate: [0, 250, 250, 250],
                    data: { type: 'gym-selfie' },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hours,
                    minute: minutes,
                    channelId: Platform.OS === 'android' ? 'gym-reminders' : undefined,
                },
            });

            return identifier;
        } catch (error) {
            console.error('Error scheduling gym selfie reminder:', error);
            return null;
        }
    }

    /**
     * Schedule meal reminder
     */
    private static async scheduleMealReminder(mealType: 'breakfast' | 'lunch' | 'dinner', time: string): Promise<string | null> {
        try {
            const [hours, minutes] = time.split(':').map(Number);
            
            const mealEmojis = {
                breakfast: '🍳',
                lunch: '🥗',
                dinner: '🍽️',
            };

            const mealTitles = {
                breakfast: 'Breakfast Time!',
                lunch: 'Lunch Time!',
                dinner: 'Dinner Time!',
            };

            const mealBodies = {
                breakfast: 'Start your day right! Log your breakfast to track your nutrition.',
                lunch: 'Time to refuel! Don\'t forget to track your lunch.',
                dinner: 'Evening meal time! Log your dinner to complete your daily nutrition.',
            };

            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `${mealEmojis[mealType]} ${mealTitles[mealType]}`,
                    body: mealBodies[mealType],
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    vibrate: [0, 250, 250, 250],
                    data: { type: 'meal-reminder', mealType },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hours,
                    minute: minutes,
                    channelId: Platform.OS === 'android' ? 'meal-reminders' : undefined,
                },
            });

            return identifier;
        } catch (error) {
            console.error(`Error scheduling ${mealType} reminder:`, error);
            return null;
        }
    }

    /**
     * Schedule water reminders throughout the day
     */
    private static async scheduleWaterReminders(intervalHours: number): Promise<string[]> {
        const identifiers: string[] = [];
        
        try {
            // Schedule water reminders from 8 AM to 10 PM
            const startHour = 8;
            const endHour = 22;
            
            for (let hour = startHour; hour <= endHour; hour += intervalHours) {
                const identifier = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "💧 Hydration Reminder",
                        body: "Time to drink some water! Stay hydrated for better performance.",
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.DEFAULT,
                        vibrate: [0, 250],
                        data: { type: 'water-reminder' },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DAILY,
                        hour: hour,
                        minute: 0,
                        channelId: Platform.OS === 'android' ? 'water-reminders' : undefined,
                    },
                });
                
                identifiers.push(identifier);
            }
        } catch (error) {
            console.error('Error scheduling water reminders:', error);
        }

        return identifiers;
    }

    /**
     * Send immediate notification (for testing or instant alerts)
     */
    static async sendImmediateNotification(title: string, body: string, data?: any): Promise<void> {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                    data,
                },
                trigger: null, // Send immediately
            });
        } catch (error) {
            console.error('Error sending immediate notification:', error);
        }
    }

    /**
     * Schedule a test notification for 1 minute from now (for testing scheduling)
     */
    static async scheduleTestNotification(): Promise<void> {
        try {
            const now = new Date();
            const testTime = new Date(now.getTime() + 60 * 1000); // 1 minute from now
            
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "🎉 Test Notification",
                    body: `Scheduled notifications are working! This was set for ${testTime.toLocaleTimeString()}`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    vibrate: [0, 250, 250, 250],
                    data: { type: 'test' },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 60, // Fire in 60 seconds
                    channelId: Platform.OS === 'android' ? 'default' : undefined,
                },
            });
            
            console.log(`Test notification scheduled for: ${testTime.toLocaleTimeString()}`);
        } catch (error) {
            console.error('Error scheduling test notification:', error);
            throw error;
        }
    }

    /**
     * Get all scheduled notifications (for debugging)
     */
    static async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    /**
     * Initialize notification service on app start
     */
    static async initialize(): Promise<void> {
        const hasPermission = await this.requestPermissions();
        if (hasPermission) {
            const settings = await this.getSettings();
            await this.scheduleAllNotifications(settings);
            // Register device token with backend
            await this.registerDeviceToken();
        }
    }

    /**
     * Get Expo Push Token
     */
    static async getExpoPushToken(): Promise<string | null> {
        try {
            if (!Device.isDevice) {
                console.log('Must use physical device for Push Notifications');
                return null;
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: '2e37e596-0347-4026-bf2c-ff9782fbc0a0',
            });

            return token.data;
        } catch (error) {
            console.error('Error getting Expo push token:', error);
            return null;
        }
    }

    /**
     * Register device token with backend
     */
    static async registerDeviceToken(): Promise<boolean> {
        try {
            const pushToken = await this.getExpoPushToken();
            
            if (!pushToken) {
                console.log('No push token available');
                return false;
            }

            const userToken = await AsyncStorage.getItem('userToken');

            if (!userToken) {
                console.log('No auth token available');
                return false;
            }

            const response = await fetch(`${BASE_URL}/device-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    token: pushToken,
                    platform: Platform.OS,
                }),
            });

            if (!response.ok) {
                console.error('Failed to register device token');
                return false;
            }

            console.log('Device token registered successfully');
            return true;
        } catch (error) {
            console.error('Error registering device token:', error);
            return false;
        }
    }

    /**
     * Unregister device token from backend (on logout)
     */
    static async unregisterDeviceToken(): Promise<void> {
        try {
            const pushToken = await this.getExpoPushToken();
            
            if (!pushToken) {
                return;
            }

            const userToken = await AsyncStorage.getItem('userToken');

            if (!userToken) {
                return;
            }

            await fetch(`${BASE_URL}/device-token`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    token: pushToken,
                }),
            });

            console.log('Device token unregistered');
        } catch (error) {
            console.error('Error unregistering device token:', error);
        }
    }
}
