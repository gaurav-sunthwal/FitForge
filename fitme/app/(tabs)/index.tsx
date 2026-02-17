import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Modal,
    Platform,
    ImageBackground, // Added import
    Image, // Added for fallback
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../../constants/Colors";
import { api } from "../../utils/api";

const { width } = Dimensions.get("window");

// Motivational quotes
const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Success starts with self-discipline.",
    "Don't wish for it, work for it.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Believe in yourself and all that you are.",
];

export default function HomeScreen() {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingTop: 60,
            paddingBottom: 30,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        headerLeft: {
            flex: 1,
        },
        greeting: {
            fontSize: 16,
            color: colors.textSecondary,
            fontWeight: "500",
            marginBottom: 2,
        },
        userName: {
            fontSize: 28,
            color: colors.textPrimary,
            fontWeight: "800",
            letterSpacing: -0.5,
        },
        streakBadge: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
        },
        streakNumber: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "800",
        },
        statsRow: {
            flexDirection: "row",
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 24,
        },
        statCard: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 8,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 14,
            elevation: 6,
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.08)",
        },
        statValue: {
            fontSize: 22,
            color: colors.textPrimary,
            fontWeight: "800",
            marginTop: 8,
        },
        statLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: "600",
            marginTop: 4,
        },
        calendarSection: {
            paddingHorizontal: 20,
            marginBottom: 32,
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "700",
        },
        toggleButton: {
            padding: 4,
        },
        sectionSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 20,
            lineHeight: 20,
        },
        weekContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: colors.cardBackground,
            paddingHorizontal: 12,
            paddingVertical: 16,
            borderRadius: 16,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        dayContainer: {
            alignItems: "center",
            gap: 8,
            flex: 1,
        },
        dayName: {
            fontSize: 11,
            color: colors.textTertiary,
            fontWeight: "600",
        },
        dateCircle: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.calendarDefault,
            justifyContent: "center",
            alignItems: "center",
        },
        todayCircle: {
            backgroundColor: colors.calendarToday,
            borderWidth: 2,
            borderColor: colors.background,
            transform: [{ scale: 1.1 }],
            shadowColor: colors.calendarToday,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
        },
        workoutCircle: {
            backgroundColor: colors.calendarWorkout,
        },
        dateText: {
            fontSize: 15,
            color: colors.textSecondary,
            fontWeight: "600",
        },
        activeDateText: {
            color: colors.textWhite,
        },
        calendarContainer: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        calendar: {
            borderRadius: 16,
        },
        calorieButtonContainer: {
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        calorieTrackButton: {
            backgroundColor: colors.cardBackground,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 2,
            borderColor: colors.accent,
        },
        calorieButtonLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
        },
        calorieIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.accent,
            justifyContent: "center",
            alignItems: "center",
        },
        calorieButtonTextContainer: {
            gap: 4,
        },
        calorieButtonTitle: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "700",
        },
        calorieButtonSubtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            fontWeight: "500",
        },
        photoSection: {
            paddingHorizontal: 20,
            marginBottom: 32,
        },
        photoButtons: {
            flexDirection: "row",
            gap: 12,
        },
        photoButton: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            gap: 12,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 6,
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.1)",
        },
        photoIconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.iconBackground,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
        },
        photoButtonText: {
            fontSize: 15,
            color: colors.textPrimary,
            fontWeight: "700",
        },
        uploadingContainer: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 32,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        uploadingText: {
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: "600",
            marginTop: 16,
        },
        progressBarContainer: {
            width: "100%",
            height: 8,
            backgroundColor: colors.calendarDefault,
            borderRadius: 4,
            marginTop: 16,
            overflow: "hidden",
        },
        progressBar: {
            height: "100%",
            backgroundColor: colors.accent,
            borderRadius: 4,
        },
        completedContainer: {
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: colors.cardBackground,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
            minHeight: 50,
            maxHeight: 300,
        },
        completedContent: {
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
        },
        completedTitle: {
            fontSize: 22,
            color: "#FFFFFF",
            fontWeight: "800",
            marginBottom: 4,
            textAlign: "center",
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        completedText: {
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            fontWeight: "600",
            marginBottom: 12,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
        completionStatsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            marginTop: 6,
            marginBottom: 8,
        },
        statBadge: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        statBadgeValue: {
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: '700',
        },
        statBadgeLabel: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 10,
            marginTop: 1,
        },
        shareButton: {
            marginTop: 8,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        shareButtonText: {
            color: colors.accent,
            fontWeight: '700',
            fontSize: 14,
        },
        quoteSection: {
            marginHorizontal: 20,
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        quoteIconContainer: {
            marginBottom: 12,
        },
        quoteText: {
            fontSize: 16,
            color: colors.textSecondary,
            fontWeight: "500",
            textAlign: "center",
            lineHeight: 24,
            fontStyle: "italic",
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
        },
        modalContent: {
            backgroundColor: colors.cardBackground,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            maxHeight: "80%",
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
        },
        modalTitle: {
            fontSize: 20,
            color: colors.textPrimary,
            fontWeight: "700",
        },
        detailCard: {
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
        },
        detailCardHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        detailCardTitle: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "700",
        },
        detailStatsRow: {
            flexDirection: "row",
            gap: 12,
            marginBottom: 12,
        },
        detailStatCard: {
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
        },
        detailStatValue: {
            fontSize: 24,
            color: colors.textPrimary,
            fontWeight: "700",
            marginTop: 8,
        },
        detailStatLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: "500",
            marginTop: 4,
        },
        exerciseItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 12,
        },
        exerciseText: {
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: "500",
        },
        photoStatus: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        photoStatusText: {
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: "600",
        },
        noDataContainer: {
            alignItems: "center",
            paddingVertical: 48,
        },
        noDataText: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "600",
            marginTop: 16,
        },
        noDataSubtext: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 8,
        },
    });

    const [currentQuote] = useState(
        quotes[Math.floor(Math.random() * quotes.length)]
    );
    const [streak, setStreak] = useState(0);
    const [stats, setStats] = useState({
        thisMonth: 0,
        consistency: 0,
    });
    const [userName, setUserName] = useState("Friend");
    const [showFullCalendar, setShowFullCalendar] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [lastUploadTime, setLastUploadTime] = useState<number | null>(null);
    const [canUpload, setCanUpload] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showDateModal, setShowDateModal] = useState(false);
    const [workoutDates, setWorkoutDates] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchInitialData();
        }, [])
    );

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [profileRes, statsRes] = await Promise.all([
                api.user.getProfile(),
                api.progress.getStats(),
            ]);

            if (profileRes.success && profileRes.data) {
                setUserName(profileRes.data.name?.split(" ")[0] || "Friend");
            }

            if (statsRes.success && statsRes.data) {
                const { currentStreak, monthlyWorkouts, workoutDates: dates } = statsRes.data;
                setStreak(currentStreak || 0);
                setStats({
                    thisMonth: monthlyWorkouts || 0,
                    consistency: Math.round(((monthlyWorkouts || 0) / 30) * 100), // Simplified
                });

                const formattedDates: { [key: string]: any } = {};
                // Add safety check for dates array
                if (dates && Array.isArray(dates)) {
                    dates.forEach((dateStr: string) => {
                        formattedDates[dateStr] = { marked: true, dotColor: colors.workoutMedium };
                    });
                }
                // Mark today as selected if not in workout dates
                const d = new Date();
                const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                // Check if today is already completed
                const isTodayCompleted = dates && dates.includes(todayStr);
                setTodayCompleted(!!isTodayCompleted);
                setCanUpload(!isTodayCompleted);

                if (!formattedDates[todayStr]) {
                    formattedDates[todayStr] = { selected: true, selectedColor: colors.calendarToday };
                } else {
                    // If today has a workout, combine styles (selected + workout)
                    formattedDates[todayStr] = {
                        ...formattedDates[todayStr],
                        selected: true,
                        selectedColor: colors.calendarToday
                    };
                }
                setWorkoutDates(formattedDates);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchInitialData();
        setRefreshing(false);
    };

    // Animation values
    const streakScale = useRef(new Animated.Value(1)).current;
    const checkmarkScale = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Check if user can upload (Daily limit)
    useEffect(() => {
        if (lastUploadTime) {
            // Simply update UI state, logic is mostly handled by initial fetch and handleUpload
            // We just want to ensure we don't accidentally enable it if lastUploadTime changes
            setTodayCompleted(true);
            setCanUpload(false);
        }
    }, [lastUploadTime]);

    useEffect(() => {
        Animated.sequence([
            Animated.spring(streakScale, {
                toValue: 1.2,
                useNativeDriver: true,
                tension: 50,
            }),
            Animated.spring(streakScale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
            }),
        ]).start();
    }, []);

    // Animate completion card if today is completed
    useEffect(() => {
        if (todayCompleted) {
            Animated.parallel([
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [todayCompleted]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    // Get current week dates
    const getWeekDates = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const diff = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    };

    const weekDates = getWeekDates();
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();

    const handleUpload = async (imageUri: string) => {
        setUploading(true);
        setUploadProgress(20);

        try {
            // In a real app, you'd upload to S3/Cloudinary first and then send URL to backend.
            // For now, we'll send a mock URL or base64.
            const response = await api.progress.uploadPhoto(imageUri, "Daily Progress");

            setUploadProgress(70);

            if (response.success) {
                // Also trigger workout complete
                await api.progress.completeWorkout({
                    workoutName: "Daily Workout",
                    duration: 45,
                    caloriesBurned: 350
                });

                setUploadProgress(100);
                setTimeout(() => {
                    setUploading(false);
                    setTodayCompleted(true);
                    setLastUploadTime(Date.now());
                    setLastUploadedImage(imageUri);
                    setCanUpload(false);

                    Animated.parallel([
                        Animated.spring(checkmarkScale, {
                            toValue: 1,
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        })
                    ]).start();

                    setStreak(prev => prev + 1);
                    Animated.sequence([
                        Animated.spring(streakScale, {
                            toValue: 1.3,
                            useNativeDriver: true,
                        }),
                        Animated.spring(streakScale, {
                            toValue: 1,
                            useNativeDriver: true,
                        }),
                    ]).start();

                    // Update stats locally instead of fetching to avoid race conditions with backend
                    const d = new Date();
                    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                    setWorkoutDates(prev => ({
                        ...prev,
                        [todayStr]: {
                            ...prev[todayStr],
                            selected: true,
                            selectedColor: colors.calendarToday,
                            marked: true,
                            dotColor: colors.workoutMedium
                        }
                    }));

                    setStats(prev => ({
                        ...prev,
                        thisMonth: prev.thisMonth + 1,
                        consistency: Math.min(100, Math.round(((prev.thisMonth + 1) / 30) * 100))
                    }));
                }, 500);
            }
        } catch (error: any) {
            setUploading(false);
            Alert.alert("Error", `Upload failed: ${error.message}`);
        }
    };

    const validateGymImage = async (imageUri: string, base64?: string): Promise<boolean> => {
        setIsValidating(true);
        try {
            let base64Data = base64;

            if (!base64Data) {
                // Fallback for when base64 is not provided
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const reader = new FileReader();

                return new Promise((resolve) => {
                    reader.onloadend = async () => {
                        try {
                            const result = reader.result as string;
                            const validationResponse = await api.ai.validateGymImage(result);
                            handleValidationResponse(validationResponse, resolve);
                        } catch (error: any) {
                            handleValidationError(error, resolve);
                        }
                    };
                    reader.onerror = () => {
                        setIsValidating(false);
                        resolve(true);
                    };
                    reader.readAsDataURL(blob);
                });
            }

            const validationResponse = await api.ai.validateGymImage(`data:image/jpeg;base64,${base64Data}`);

            return new Promise((resolve) => {
                handleValidationResponse(validationResponse, resolve);
            });
        } catch (error: any) {
            return new Promise((resolve) => {
                handleValidationError(error, resolve);
            });
        }
    };

    const handleValidationResponse = (validationResponse: any, resolve: (val: boolean) => void) => {
        setIsValidating(false);
        if (validationResponse.success && validationResponse.isGymImage) {
            resolve(true);
        } else {
            Alert.alert(
                "❌ Not a Gym Photo",
                validationResponse.message || "Please upload a gym/workout related photo.",
                [
                    { text: "Try Again", style: "default" },
                    {
                        text: "Upload Anyway",
                        style: "destructive",
                        onPress: () => resolve(true),
                    },
                ]
            );
            resolve(false);
        }
    };

    const handleValidationError = (error: any, resolve: (val: boolean) => void) => {
        setIsValidating(false);
        if (error.message?.includes("API key") || error.message?.includes("requiresApiKey")) {
            Alert.alert(
                "API Key Required",
                "You need to add your Gemini API key to use AI image validation. Would you like to add it now?",
                [
                    {
                        text: "Skip Validation",
                        style: "cancel",
                        onPress: () => resolve(true),
                    },
                    {
                        text: "Add API Key",
                        onPress: () => {
                            router.push("/ai-settings");
                            resolve(false);
                        },
                    },
                ]
            );
        } else {
            console.warn("Validation error:", error);
            Alert.alert(
                "Validation Error",
                "There was a problem checking your image. You can skip validation and upload it anyway.",
                [
                    { text: "Try Again", style: "default" },
                    { text: "Upload Anyway", onPress: () => resolve(true) }
                ]
            );
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Needed", "We need your permission to access your gallery.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            const isValid = await validateGymImage(result.assets[0].uri, result.assets[0].base64 || undefined);
            if (isValid) {
                await handleUpload(result.assets[0].uri);
            }
        }
    };

    const takePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Needed", "We need your permission to access your camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            const isValid = await validateGymImage(result.assets[0].uri, result.assets[0].base64 || undefined);
            if (isValid) {
                await handleUpload(result.assets[0].uri);
            }
        }
    };

    const getWorkoutDataForDate = (dateString: string) => {
        if (!workoutDates[dateString]?.marked && !workoutDates[dateString]?.selected) {
            return null;
        }

        const date = new Date(dateString);
        const day = date.getDate();

        return {
            date: dateString,
            photoUploaded: workoutDates[dateString]?.marked || (workoutDates[dateString]?.selected && todayCompleted),
            workoutType: day % 2 === 0 ? "Strength Training" : "Cardio",
            duration: Math.floor(Math.random() * 30) + 30,
            calories: Math.floor(Math.random() * 300) + 200,
            exercises: day % 2 === 0
                ? ["Bench Press", "Squats", "Deadlifts"]
                : ["Running", "Cycling", "Jump Rope"],
        };
    };

    const handleDayPress = (day: any) => {
        setSelectedDate(day.dateString);
        setShowDateModal(true);
    };

    const workoutData = selectedDate ? getWorkoutDataForDate(selectedDate) : null;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {/* Notifications Bell */}
                        <TouchableOpacity
                            onPress={() => router.push('/notifications-inbox')}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: colors.iconBackground,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1.5,
                                borderColor: colors.border,
                            }}
                        >
                            <Ionicons name="notifications" size={22} color={colors.accent} />
                        </TouchableOpacity>

                        {/* Streak Badge */}
                        <Animated.View
                            style={[
                                { transform: [{ scale: streakScale }] },
                                { shadowColor: "#FF5E62", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }
                            ]}
                        >
                            <LinearGradient
                                colors={['#FF9966', '#FF5E62']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.streakBadge}
                            >
                                <Ionicons name="flame" size={20} color="#FFF" />
                                <Text style={[styles.streakNumber, { color: '#FFF' }]}>{streak}</Text>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                </View>

                {/* Weekly Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="calendar" size={20} color={colors.accent} />
                        <Text style={styles.statValue}>{streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="trophy" size={20} color="#FFD700" />
                        <Text style={styles.statValue}>{stats.thisMonth}</Text>
                        <Text style={styles.statLabel}>This Month</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="trending-up" size={20} color="#4ADE80" />
                        <Text style={styles.statValue}>{stats.consistency}%</Text>
                        <Text style={styles.statLabel}>Consistency</Text>
                    </View>
                </View>



                {/* Calendar Section */}
                <View style={styles.calendarSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Consistency</Text>
                        <TouchableOpacity
                            onPress={() => setShowFullCalendar(!showFullCalendar)}
                            style={styles.toggleButton}
                        >
                            <Ionicons
                                name={showFullCalendar ? "chevron-up" : "chevron-down"}
                                size={20}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {!showFullCalendar ? (
                        // Week View (Compact)
                        <View style={styles.weekContainer}>
                            {weekDates.map((date, index) => {
                                const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                                    date.getDay()
                                ];
                                const dateNum = date.getDate();
                                const isToday = dateNum === today && date.getMonth() === currentMonth;
                                // Use local date string to match keys
                                const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                const hasWorkout = workoutDates[dateString]?.marked || workoutDates[dateString]?.selected;

                                return (
                                    <View key={index} style={styles.dayContainer}>
                                        <Text style={styles.dayName}>{dayName}</Text>
                                        <TouchableOpacity
                                            onPress={() => handleDayPress({ dateString })}
                                            activeOpacity={0.7}
                                        >
                                            <View
                                                style={[
                                                    styles.dateCircle,
                                                    isToday && styles.todayCircle,
                                                    hasWorkout && styles.workoutCircle,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.dateText,
                                                        (isToday || hasWorkout) && styles.activeDateText,
                                                    ]}
                                                >
                                                    {dateNum}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        // Full Month View
                        <View style={styles.calendarContainer}>
                            <Calendar
                                markedDates={workoutDates}
                                onDayPress={handleDayPress}
                                theme={{
                                    backgroundColor: colors.cardBackground,
                                    calendarBackground: colors.cardBackground,
                                    textSectionTitleColor: colors.textSecondary,
                                    selectedDayBackgroundColor: colors.calendarToday,
                                    selectedDayTextColor: colors.textWhite,
                                    todayTextColor: colors.accent,
                                    dayTextColor: colors.textPrimary,
                                    textDisabledColor: colors.textLight,
                                    dotColor: colors.accent,
                                    selectedDotColor: colors.textWhite,
                                    arrowColor: colors.textPrimary,
                                    monthTextColor: colors.textPrimary,
                                    textDayFontWeight: '600',
                                    textMonthFontWeight: '700',
                                    textDayHeaderFontWeight: '600',
                                    textDayFontSize: 14,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 12,
                                }}
                                style={styles.calendar}
                            />
                        </View>
                    )}
                </View>

                {/* Photo Upload Section */}
                <View style={styles.photoSection}>
                    <Text style={[styles.sectionTitle, { fontSize: 20, marginBottom: 8 }]}>Daily Check-in</Text>
                    <Text style={[styles.sectionSubtitle, { fontSize: 15, marginBottom: 20, color: colors.textSecondary, fontWeight: '600' }]}>
                        📸 Snap a photo to keep your streak alive!
                    </Text>

                    {uploading || loading ? (
                        <View style={styles.uploadingContainer}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={styles.uploadingText}>
                                {uploading ? `Uploading... ${uploadProgress}%` : "Loading status..."}
                            </Text>
                            {uploading && (
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                                </View>
                            )}
                        </View>
                    ) : todayCompleted && !canUpload ? (
                        <Animated.View
                            style={[
                                styles.completedContainer,
                                {
                                    transform: [{ scale: checkmarkScale }],
                                    opacity: fadeAnim
                                }
                            ]}
                        >
                            <ImageBackground
                                source={lastUploadedImage ? { uri: lastUploadedImage } : { uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" }}
                                style={{ width: '100%', height: '100%', minHeight: 180 }}
                                imageStyle={{ borderRadius: 20 }}
                            >
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                                    style={styles.completedContent}
                                >
                                    <View style={{ marginBottom: 10 }}>
                                        <Ionicons name="checkmark-circle" size={48} color="#4ADE80" />
                                    </View>

                                    <Text style={styles.completedTitle}>Workout Crushed!</Text>
                                    <Text style={styles.completedText}>You're one step closer to your goal.</Text>

                                    <View style={styles.completionStatsRow}>

                                        <View style={styles.statBadge}>
                                            <Text style={styles.statBadgeValue}>+1 Day</Text>
                                            <Text style={styles.statBadgeLabel}>Streak</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.shareButton}
                                        onPress={() => router.push('/calories')}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="flame" size={18} color={colors.accent} />
                                        <Text style={styles.shareButtonText}>Track Calories</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </ImageBackground>
                        </Animated.View>
                    ) : (
                        <View style={styles.photoButtons}>
                            <TouchableOpacity
                                style={styles.photoButton}
                                onPress={takePicture}
                            >
                                <View style={styles.photoIconContainer}>
                                    <Ionicons name="camera" size={32} color={colors.textPrimary} />
                                </View>
                                <Text style={styles.photoButtonText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <View style={styles.photoIconContainer}>
                                    <Ionicons name="images" size={32} color={colors.textPrimary} />
                                </View>
                                <Text style={styles.photoButtonText}>Upload Photo</Text>
                            </TouchableOpacity>
                        </View>

                    )}
                </View>

                {/* Motivational Quote */}
                <View style={styles.quoteSection}>
                    <View style={styles.quoteIconContainer}>
                        <Ionicons name="sparkles" size={24} color={colors.quoteAccent} />
                    </View>
                    <Text style={styles.quoteText}>"{currentQuote}"</Text>
                </View>
            </ScrollView>

            {/* Date Details Modal */}
            <Modal
                visible={showDateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) : ''}
                            </Text>
                            <TouchableOpacity onPress={() => setShowDateModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {workoutData ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Workout Type Card */}
                                <View style={styles.detailCard}>
                                    <View style={styles.detailCardHeader}>
                                        <Ionicons
                                            name={workoutData.workoutType === "Cardio" ? "bicycle" : "barbell"}
                                            size={24}
                                            color={colors.accent}
                                        />
                                        <Text style={styles.detailCardTitle}>{workoutData.workoutType}</Text>
                                    </View>
                                </View>

                                {/* Stats Row */}
                                <View style={styles.detailStatsRow}>
                                    <View style={styles.detailStatCard}>
                                        <Ionicons name="flame" size={20} color="#FF6B35" />
                                        <Text style={styles.detailStatValue}>{workoutData.calories}</Text>
                                        <Text style={styles.detailStatLabel}>Calories</Text>
                                    </View>
                                    <View style={styles.detailStatCard}>
                                        <Ionicons name="time" size={20} color="#4ADE80" />
                                        <Text style={styles.detailStatValue}>{workoutData.duration}</Text>
                                        <Text style={styles.detailStatLabel}>Minutes</Text>
                                    </View>
                                </View>

                                {/* Exercises */}
                                <View style={styles.detailCard}>
                                    <Text style={styles.detailCardTitle}>Exercises</Text>
                                    {workoutData.exercises.map((exercise, index) => (
                                        <View key={index} style={styles.exerciseItem}>
                                            <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                                            <Text style={styles.exerciseText}>{exercise}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Photo Status */}
                                <View style={styles.detailCard}>
                                    <View style={styles.photoStatus}>
                                        <Ionicons
                                            name={workoutData.photoUploaded ? "checkmark-circle" : "close-circle"}
                                            size={24}
                                            color={workoutData.photoUploaded ? "#4ADE80" : colors.textTertiary}
                                        />
                                        <Text style={styles.photoStatusText}>
                                            {workoutData.photoUploaded ? "Photo Uploaded ✓" : "No Photo"}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Ionicons name="calendar-outline" size={64} color={colors.textTertiary} />
                                <Text style={styles.noDataText}>No workout logged for this day</Text>
                                <Text style={styles.noDataSubtext}>Start tracking your progress!</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            {/* AI Validation Loading Overlay */}
            {isValidating && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }]}>
                    <View style={{ backgroundColor: colors.cardBackground, padding: 30, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>Validating Photo...</Text>
                        <Text style={{ marginTop: 8, fontSize: 14, color: colors.textSecondary }}>Checking if this is a gym photo</Text>
                    </View>
                </View>
            )}
        </View>
    );
}
