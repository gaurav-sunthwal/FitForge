import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Modal,
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
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: "500",
            marginBottom: 4,
        },
        userName: {
            fontSize: 20,
            color: colors.textPrimary,
            fontWeight: "700",
            lineHeight: 26,
        },
        streakBadge: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.cardBackground,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
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
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        statValue: {
            fontSize: 20,
            color: colors.textPrimary,
            fontWeight: "700",
            marginTop: 8,
        },
        statLabel: {
            fontSize: 11,
            color: colors.textSecondary,
            fontWeight: "500",
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
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        photoIconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.iconBackground,
            justifyContent: "center",
            alignItems: "center",
        },
        photoButtonText: {
            fontSize: 14,
            color: colors.textPrimary,
            fontWeight: "600",
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
        checkmarkCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#4ADE80",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
        },
        completedTitle: {
            fontSize: 24,
            color: colors.textPrimary,
            fontWeight: "700",
            marginBottom: 8,
        },
        completedText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: 4,
        },
        completedSubtext: {
            fontSize: 14,
            color: colors.textTertiary,
            textAlign: "center",
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
    const [userName, setUserName] = useState("Gaurav");
    const [showFullCalendar, setShowFullCalendar] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [lastUploadTime, setLastUploadTime] = useState<number | null>(null);
    const [canUpload, setCanUpload] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showDateModal, setShowDateModal] = useState(false);
    const [workoutDates, setWorkoutDates] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [profileRes, statsRes] = await Promise.all([
                api.user.getProfile(),
                api.progress.getStats(),
            ]);

            if (profileRes.success && profileRes.data) {
                setUserName(profileRes.data.name?.split(" ")[0] || "Gaurav");
            }

            if (statsRes.success && statsRes.data) {
                const { currentStreak, monthlyWorkouts, workoutDates: dates } = statsRes.data;
                setStreak(currentStreak);
                setStats({
                    thisMonth: monthlyWorkouts,
                    consistency: Math.round((monthlyWorkouts / 30) * 100), // Simplified
                });

                const formattedDates: { [key: string]: any } = {};
                dates.forEach((dateStr: string) => {
                    formattedDates[dateStr] = { marked: true, dotColor: colors.workoutMedium };
                });
                // Mark today as selected if not in workout dates
                const todayStr = new Date().toISOString().split('T')[0];
                if (!formattedDates[todayStr]) {
                    formattedDates[todayStr] = { selected: true, selectedColor: colors.calendarToday };
                }
                setWorkoutDates(formattedDates);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Animation values
    const streakScale = new Animated.Value(1);
    const checkmarkScale = new Animated.Value(0);

    // Check if user can upload (1 hour cooldown)
    useEffect(() => {
        if (lastUploadTime) {
            const oneHour = 60 * 60 * 1000;
            const timePassed = Date.now() - lastUploadTime;

            if (timePassed < oneHour) {
                setCanUpload(false);
                setTodayCompleted(true);

                const remainingTime = oneHour - timePassed;
                setTimeout(() => {
                    setCanUpload(true);
                    setTodayCompleted(false);
                }, remainingTime);
            }
        }
    }, [lastUploadTime]);

    // Animate streak on mount
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
                    setCanUpload(false);

                    Animated.spring(checkmarkScale, {
                        toValue: 1,
                        useNativeDriver: true,
                        tension: 50,
                    }).start();

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

                    // Refresh stats
                    fetchInitialData();
                }, 500);
            }
        } catch (error: any) {
            setUploading(false);
            Alert.alert("Error", `Upload failed: ${error.message}`);
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
        });

        if (!result.canceled) {
            await handleUpload(result.assets[0].uri);
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
        });

        if (!result.canceled) {
            await handleUpload(result.assets[0].uri);
        }
    };

    const getWorkoutDataForDate = (dateString: string) => {
        if (!workoutDates[dateString]?.marked) {
            return null;
        }

        const date = new Date(dateString);
        const day = date.getDate();

        return {
            date: dateString,
            photoUploaded: true,
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
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
                        <Text style={styles.userName}>Let's stay consistent, {userName}</Text>
                    </View>
                    <Animated.View
                        style={[
                            styles.streakBadge,
                            { transform: [{ scale: streakScale }] }
                        ]}
                    >
                        <Ionicons name="flame" size={24} color={colors.accent} />
                        <Text style={styles.streakNumber}>{streak}</Text>
                    </Animated.View>
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
                                const dateString = date.toISOString().split('T')[0];
                                const hasWorkout = workoutDates[dateString]?.marked;

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
                    <Text style={styles.sectionTitle}>Track Your Progress</Text>
                    <Text style={styles.sectionSubtitle}>
                        Upload your gym photos to see your transformation
                    </Text>

                    {uploading ? (
                        <View style={styles.uploadingContainer}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={styles.uploadingText}>Uploading... {uploadProgress}%</Text>
                            <View style={styles.progressBarContainer}>
                                <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                            </View>
                        </View>
                    ) : todayCompleted && !canUpload ? (
                        <Animated.View
                            style={[
                                styles.completedContainer,
                                { transform: [{ scale: checkmarkScale }] }
                            ]}
                        >
                            <View style={styles.checkmarkCircle}>
                                <Ionicons name="checkmark" size={48} color={colors.textWhite} />
                            </View>
                            <Text style={styles.completedTitle}>Great Job! 🎉</Text>
                            <Text style={styles.completedText}>
                                You've logged your workout for today!
                            </Text>
                            <Text style={styles.completedSubtext}>
                                Come back tomorrow to continue your streak
                            </Text>
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
        </View>
    );
}


