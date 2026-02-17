import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "../constants/Colors";
import { NotificationService, NotificationSettings } from "../utils/notificationService";

export default function NotificationSettingsScreen() {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "ios" ? 60 : 40,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            marginRight: 16,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: "800",
            color: colors.textPrimary,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingVertical: 24,
        },
        section: {
            marginBottom: 32,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            gap: 8,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.textPrimary,
        },
        sectionDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 16,
            lineHeight: 20,
        },
        settingCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        settingRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        settingLeft: {
            flex: 1,
            marginRight: 12,
        },
        settingLabel: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.textPrimary,
            marginBottom: 4,
        },
        settingSubLabel: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        timeButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: colors.iconBackground,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        timeText: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.accent,
        },
        intervalButton: {
            backgroundColor: colors.iconBackground,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        intervalText: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.accent,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 12,
        },
        testButton: {
            backgroundColor: colors.accent,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginTop: 8,
        },
        testButtonText: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.textWhite,
        },
        permissionCard: {
            backgroundColor: "#FFF3CD",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
        },
        permissionContent: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 12,
        },
        permissionText: {
            flex: 1,
            fontSize: 14,
            color: "#856404",
            lineHeight: 20,
        },
        enableButton: {
            backgroundColor: "#856404",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 4,
        },
        enableButtonText: {
            color: "#FFF3CD",
            fontSize: 14,
            fontWeight: "700",
        },
    });

    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<NotificationSettings>({
        gymSelfieEnabled: true,
        gymSelfieTime: "19:00",
        mealReminderEnabled: true,
        breakfastTime: "08:00",
        lunchTime: "13:00",
        dinnerTime: "20:00",
        waterReminderEnabled: true,
        waterReminderInterval: 2,
    });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [activeTimeSetting, setActiveTimeSetting] = useState<keyof NotificationSettings | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        loadSettings();
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const granted = await NotificationService.requestPermissions();
        setHasPermission(granted);
    };

    const loadSettings = async () => {
        try {
            setLoading(true);
            const currentSettings = await NotificationService.getSettings();
            setSettings(currentSettings);
        } catch (error) {
            console.error("Error loading settings:", error);
            Alert.alert("Error", "Failed to load notification settings");
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (newSettings: NotificationSettings) => {
        try {
            await NotificationService.saveSettings(newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error("Error saving settings:", error);
            Alert.alert("Error", "Failed to save notification settings");
        }
    };

    const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        await saveSettings(newSettings);
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');

        if (event.type === 'dismissed') {
            setShowTimePicker(false);
            setActiveTimeSetting(null);
            return;
        }

        if (selectedDate && activeTimeSetting) {
            const hours = selectedDate.getHours().toString().padStart(2, '0');
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            const newSettings = { ...settings, [activeTimeSetting]: timeString };
            saveSettings(newSettings);

            if (Platform.OS === 'android') {
                setShowTimePicker(false);
                setActiveTimeSetting(null);
            }
        }
    };

    const openTimePicker = (settingKey: keyof NotificationSettings) => {
        setActiveTimeSetting(settingKey);
        setShowTimePicker(true);
    };

    const getDateFromTime = (timeString: string): Date => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    };

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const handleIntervalChange = () => {
        Alert.alert(
            "Water Reminder Interval",
            "How often should we remind you to drink water?",
            [
                {
                    text: "Every Hour",
                    onPress: () => {
                        const newSettings = { ...settings, waterReminderInterval: 1 };
                        saveSettings(newSettings);
                    },
                },
                {
                    text: "Every 2 Hours",
                    onPress: () => {
                        const newSettings = { ...settings, waterReminderInterval: 2 };
                        saveSettings(newSettings);
                    },
                },
                {
                    text: "Every 3 Hours",
                    onPress: () => {
                        const newSettings = { ...settings, waterReminderInterval: 3 };
                        saveSettings(newSettings);
                    },
                },
                {
                    text: "Every 4 Hours",
                    onPress: () => {
                        const newSettings = { ...settings, waterReminderInterval: 4 };
                        saveSettings(newSettings);
                    },
                },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };

    const handleTestNotification = async () => {
        try {
            const now = new Date();
            const testTime = new Date(now.getTime() + 60 * 1000);

            await NotificationService.scheduleTestNotification();

            Alert.alert(
                "Test Scheduled!",
                `A test notification will appear in 1 minute at ${testTime.toLocaleTimeString()}. ` +
                `\n\nYou can close the app to test background notifications!`,
                [{ text: "OK" }]
            );
        } catch (error) {
            console.error("Error scheduling test:", error);
            Alert.alert("Error", "Failed to schedule test notification");
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Permission Warning */}
                {!hasPermission && (
                    <View style={styles.permissionCard}>
                        <View style={styles.permissionContent}>
                            <Ionicons name="warning" size={24} color="#856404" />
                            <Text style={styles.permissionText}>
                                Notification permissions are required for reminders to work. Please enable them in your device settings.
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.enableButton}
                            onPress={() => {
                                Linking.openSettings().catch(() => {
                                    Alert.alert(
                                        "Cannot Open Settings",
                                        "Please manually go to Settings → Notifications → FitForge and enable notifications."
                                    );
                                });
                            }}
                        >
                            <Text style={styles.enableButtonText}>Open Settings</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Gym Selfie Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="camera" size={24} color={colors.accent} />
                        <Text style={styles.sectionTitle}>Gym Progress</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Get reminded to take your daily gym selfie and track your transformation journey.
                    </Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Text style={styles.settingLabel}>Daily Reminder</Text>
                                <Text style={styles.settingSubLabel}>
                                    Remind me to upload gym selfie
                                </Text>
                            </View>
                            <Switch
                                value={settings.gymSelfieEnabled}
                                onValueChange={(value) => handleToggle('gymSelfieEnabled', value)}
                                trackColor={{ false: colors.border, true: colors.accent }}
                                thumbColor={colors.textWhite}
                            />
                        </View>

                        {settings.gymSelfieEnabled && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.settingRow}>
                                    <View style={styles.settingLeft}>
                                        <Text style={styles.settingLabel}>Reminder Time</Text>
                                        <Text style={styles.settingSubLabel}>
                                            When should we remind you?
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => openTimePicker('gymSelfieTime')}
                                    >
                                        <Ionicons name="time-outline" size={20} color={colors.accent} />
                                        <Text style={styles.timeText}>
                                            {formatTime(settings.gymSelfieTime)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Meal Reminders Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="restaurant" size={24} color={colors.accent} />
                        <Text style={styles.sectionTitle}>Meal Tracking</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Never miss logging your meals. Get reminders for breakfast, lunch, and dinner.
                    </Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Text style={styles.settingLabel}>Meal Reminders</Text>
                                <Text style={styles.settingSubLabel}>
                                    Remind me to log my meals
                                </Text>
                            </View>
                            <Switch
                                value={settings.mealReminderEnabled}
                                onValueChange={(value) => handleToggle('mealReminderEnabled', value)}
                                trackColor={{ false: colors.border, true: colors.accent }}
                                thumbColor={colors.textWhite}
                            />
                        </View>

                        {settings.mealReminderEnabled && (
                            <>
                                <View style={styles.divider} />

                                {/* Breakfast */}
                                <View style={styles.settingRow}>
                                    <View style={styles.settingLeft}>
                                        <Text style={styles.settingLabel}>🍳 Breakfast</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => openTimePicker('breakfastTime')}
                                    >
                                        <Ionicons name="time-outline" size={20} color={colors.accent} />
                                        <Text style={styles.timeText}>
                                            {formatTime(settings.breakfastTime)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.divider} />

                                {/* Lunch */}
                                <View style={styles.settingRow}>
                                    <View style={styles.settingLeft}>
                                        <Text style={styles.settingLabel}>🥗 Lunch</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => openTimePicker('lunchTime')}
                                    >
                                        <Ionicons name="time-outline" size={20} color={colors.accent} />
                                        <Text style={styles.timeText}>
                                            {formatTime(settings.lunchTime)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.divider} />

                                {/* Dinner */}
                                <View style={styles.settingRow}>
                                    <View style={styles.settingLeft}>
                                        <Text style={styles.settingLabel}>🍽️ Dinner</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => openTimePicker('dinnerTime')}
                                    >
                                        <Ionicons name="time-outline" size={20} color={colors.accent} />
                                        <Text style={styles.timeText}>
                                            {formatTime(settings.dinnerTime)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Water Reminders Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="water" size={24} color="#2196F3" />
                        <Text style={styles.sectionTitle}>Hydration</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Stay hydrated throughout the day with regular water intake reminders.
                    </Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Text style={styles.settingLabel}>Water Reminders</Text>
                                <Text style={styles.settingSubLabel}>
                                    Remind me to drink water
                                </Text>
                            </View>
                            <Switch
                                value={settings.waterReminderEnabled}
                                onValueChange={(value) => handleToggle('waterReminderEnabled', value)}
                                trackColor={{ false: colors.border, true: colors.accent }}
                                thumbColor={colors.textWhite}
                            />
                        </View>

                        {settings.waterReminderEnabled && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.settingRow}>
                                    <View style={styles.settingLeft}>
                                        <Text style={styles.settingLabel}>Reminder Interval</Text>
                                        <Text style={styles.settingSubLabel}>
                                            Between 8 AM - 10 PM
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.intervalButton}
                                        onPress={handleIntervalChange}
                                    >
                                        <Text style={styles.intervalText}>
                                            Every {settings.waterReminderInterval}h
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Test Notification Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="notifications" size={24} color={colors.accent} />
                        <Text style={styles.sectionTitle}>Test Notifications</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Test if notifications are working correctly on your device.
                    </Text>

                    {/* Instant Test Button */}
                    <TouchableOpacity
                        style={[styles.testButton, { backgroundColor: '#4CAF50' }]}
                        onPress={async () => {
                            try {
                                await NotificationService.sendImmediateNotification(
                                    "🎉 Test Notification",
                                    "Instant notifications are working! This appeared immediately."
                                );
                                Alert.alert(
                                    "Sent!",
                                    "Check your notification bar. The notification should appear instantly.",
                                    [{ text: "OK" }]
                                );
                            } catch (error) {
                                console.error("Error sending instant test:", error);
                                Alert.alert("Error", "Failed to send instant notification");
                            }
                        }}
                    >
                        <Text style={styles.testButtonText}>⚡ Send Test Notification Now</Text>
                    </TouchableOpacity>

                    {/* Scheduled Test Button */}
                    <TouchableOpacity
                        style={[styles.testButton, { marginTop: 12 }]}
                        onPress={handleTestNotification}
                    >
                        <Text style={styles.testButtonText}>⏰ Test in 1 Minute (Scheduled)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Time Picker */}
            {showTimePicker && activeTimeSetting && (
                <DateTimePicker
                    value={getDateFromTime(settings[activeTimeSetting] as string)}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
}
