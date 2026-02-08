import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import { useTheme } from "../../constants/Colors";
import { api } from "../../utils/api";

const { width } = Dimensions.get("window");
const chartWidth = width - 40;

type TimeRange = "week" | "month" | "3months";

interface AnalyticsData {
    caloriesTrend: number[];
    proteinTrend: number[];
    waterTrend: number[];
    workoutDays: number[];
    caloriesBurned: number[];
    labels: string[];
    averages: {
        calories: number;
        protein: number;
        water: number;
        workouts: number;
    };
    goals: {
        calories: number;
        protein: number;
        water: number;
    };
}

export default function AnalyticsScreen() {
    const { colors } = useTheme();
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingTop: Platform.OS === "ios" ? 60 : 40,
            paddingBottom: 30,
        },
        header: {
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 32,
            fontWeight: "800",
            color: colors.textPrimary,
            marginBottom: 8,
        },
        headerSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            fontWeight: "500",
        },
        timeRangeSelector: {
            flexDirection: "row",
            paddingHorizontal: 20,
            marginBottom: 24,
            gap: 12,
        },
        timeRangeButton: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: colors.cardBackground,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "transparent",
        },
        timeRangeButtonActive: {
            backgroundColor: colors.accent,
            borderColor: colors.accent,
        },
        timeRangeText: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.textSecondary,
        },
        timeRangeTextActive: {
            color: colors.textWhite,
        },
        summaryCards: {
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 24,
        },
        summaryCard: {
            width: (width - 52) / 2,
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 16,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        summaryCardHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
        },
        summaryCardTitle: {
            fontSize: 13,
            fontWeight: "600",
            color: colors.textSecondary,
            flex: 1,
        },
        summaryCardValue: {
            fontSize: 28,
            fontWeight: "800",
            color: colors.textPrimary,
            marginBottom: 4,
        },
        summaryCardSubtext: {
            fontSize: 12,
            fontWeight: "500",
            color: colors.textTertiary,
        },
        chartSection: {
            marginBottom: 32,
            paddingHorizontal: 20,
        },
        chartCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        chartHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            gap: 10,
        },
        chartTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: colors.textPrimary,
            flex: 1,
        },
        chartSubtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 16,
            fontWeight: "500",
        },
        emptyState: {
            alignItems: "center",
            paddingVertical: 60,
        },
        emptyStateText: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.textSecondary,
            marginTop: 16,
        },
        emptyStateSubtext: {
            fontSize: 14,
            color: colors.textTertiary,
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: 40,
        },
        insightCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 20,
            marginBottom: 24,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        insightHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            gap: 10,
        },
        insightTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
        },
        insightText: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        progressRingSection: {
            marginBottom: 32,
            paddingHorizontal: 20,
        },
        progressRingCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await api.progress.getAnalytics(timeRange);

            if (response.success && response.data) {
                setAnalyticsData(response.data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            // Set mock data for demonstration
            setAnalyticsData(getMockData());
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAnalyticsData();
        setRefreshing(false);
    };

    const getMockData = (): AnalyticsData => {
        const daysCount = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90;
        const labels = [];
        const caloriesTrend = [];
        const proteinTrend = [];
        const waterTrend = [];
        const workoutDays = [];
        const caloriesBurned = [];

        for (let i = 0; i < daysCount; i++) {
            if (timeRange === "week") {
                labels.push(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]);
            } else if (timeRange === "month") {
                if (i % 5 === 0) labels.push(`${i + 1}`);
            } else {
                if (i % 15 === 0) labels.push(`Day ${i + 1}`);
            }

            caloriesTrend.push(Math.floor(Math.random() * 500) + 1500);
            proteinTrend.push(Math.floor(Math.random() * 50) + 100);
            waterTrend.push(Math.floor(Math.random() * 4) + 4);
            workoutDays.push(Math.random() > 0.3 ? 1 : 0);
            caloriesBurned.push(Math.floor(Math.random() * 300) + 200);
        }

        return {
            caloriesTrend,
            proteinTrend,
            waterTrend,
            workoutDays,
            caloriesBurned,
            labels: timeRange === "week" ? labels : labels.filter((_, i) => i % (timeRange === "month" ? 5 : 15) === 0),
            averages: {
                calories: Math.floor(caloriesTrend.reduce((a, b) => a + b, 0) / caloriesTrend.length),
                protein: Math.floor(proteinTrend.reduce((a, b) => a + b, 0) / proteinTrend.length),
                water: Math.floor(waterTrend.reduce((a, b) => a + b, 0) / waterTrend.length),
                workouts: workoutDays.filter(d => d === 1).length,
            },
            goals: {
                calories: 2000,
                protein: 150,
                water: 8,
            },
        };
    };

    const chartConfig = {
        backgroundColor: colors.cardBackground,
        backgroundGradientFrom: colors.cardBackground,
        backgroundGradientTo: colors.cardBackground,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        labelColor: (opacity = 1) => colors.textSecondary,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.accent,
        },
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: colors.border,
            strokeWidth: 1,
        },
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!analyticsData) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyState}>
                    <Ionicons name="analytics-outline" size={64} color={colors.textLight} />
                    <Text style={styles.emptyStateText}>No Data Available</Text>
                    <Text style={styles.emptyStateSubtext}>
                        Start tracking your nutrition and workouts to see your performance analytics
                    </Text>
                </View>
            </View>
        );
    }

    const { averages, goals } = analyticsData;
    const calorieProgress = Math.min((averages.calories / goals.calories), 1);
    const proteinProgress = Math.min((averages.protein / goals.protein), 1);
    const waterProgress = Math.min((averages.water / goals.water), 1);

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
                    <Text style={styles.headerTitle}>Performance</Text>
                    <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
                </View>

                {/* Time Range Selector */}
                <View style={styles.timeRangeSelector}>
                    <TouchableOpacity
                        style={[
                            styles.timeRangeButton,
                            timeRange === "week" && styles.timeRangeButtonActive,
                        ]}
                        onPress={() => setTimeRange("week")}
                    >
                        <Text
                            style={[
                                styles.timeRangeText,
                                timeRange === "week" && styles.timeRangeTextActive,
                            ]}
                        >
                            Week
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.timeRangeButton,
                            timeRange === "month" && styles.timeRangeButtonActive,
                        ]}
                        onPress={() => setTimeRange("month")}
                    >
                        <Text
                            style={[
                                styles.timeRangeText,
                                timeRange === "month" && styles.timeRangeTextActive,
                            ]}
                        >
                            Month
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.timeRangeButton,
                            timeRange === "3months" && styles.timeRangeButtonActive,
                        ]}
                        onPress={() => setTimeRange("3months")}
                    >
                        <Text
                            style={[
                                styles.timeRangeText,
                                timeRange === "3months" && styles.timeRangeTextActive,
                            ]}
                        >
                            3 Months
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryCards}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryCardHeader}>
                            <Ionicons name="flame" size={20} color={colors.accent} />
                            <Text style={styles.summaryCardTitle}>Avg Calories</Text>
                        </View>
                        <Text style={styles.summaryCardValue}>{averages.calories}</Text>
                        <Text style={styles.summaryCardSubtext}>
                            Goal: {goals.calories} cal/day
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryCardHeader}>
                            <Ionicons name="nutrition" size={20} color="#4CAF50" />
                            <Text style={styles.summaryCardTitle}>Avg Protein</Text>
                        </View>
                        <Text style={styles.summaryCardValue}>{averages.protein}g</Text>
                        <Text style={styles.summaryCardSubtext}>
                            Goal: {goals.protein}g/day
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryCardHeader}>
                            <Ionicons name="water" size={20} color="#2196F3" />
                            <Text style={styles.summaryCardTitle}>Avg Water</Text>
                        </View>
                        <Text style={styles.summaryCardValue}>{averages.water}</Text>
                        <Text style={styles.summaryCardSubtext}>
                            Goal: {goals.water} glasses/day
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryCardHeader}>
                            <Ionicons name="barbell" size={20} color="#9C27B0" />
                            <Text style={styles.summaryCardTitle}>Workouts</Text>
                        </View>
                        <Text style={styles.summaryCardValue}>{averages.workouts}</Text>
                        <Text style={styles.summaryCardSubtext}>
                            {timeRange === "week" ? "This week" : timeRange === "month" ? "This month" : "Last 3 months"}
                        </Text>
                    </View>
                </View>

                {/* Goal Progress Rings */}
                <View style={styles.progressRingSection}>
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="trophy" size={24} color="#FFD700" />
                            <Text style={styles.chartTitle}>Goal Achievement</Text>
                        </View>
                        <ProgressChart
                            data={{
                                labels: ["Calories", "Protein", "Water"],
                                data: [calorieProgress, proteinProgress, waterProgress],
                            }}
                            width={chartWidth - 40}
                            height={220}
                            strokeWidth={16}
                            radius={32}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1, index) => {
                                    const colors = [
                                        `rgba(255, 107, 107, ${opacity})`,
                                        `rgba(76, 175, 80, ${opacity})`,
                                        `rgba(33, 150, 243, ${opacity})`,
                                    ];
                                    return colors[index || 0];
                                },
                            }}
                            hideLegend={false}
                        />
                    </View>
                </View>

                {/* Calorie Trend Chart */}
                <View style={styles.chartSection}>
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="trending-up" size={24} color={colors.accent} />
                            <Text style={styles.chartTitle}>Calorie Intake</Text>
                        </View>
                        <Text style={styles.chartSubtitle}>
                            Daily calorie consumption over time
                        </Text>
                        <LineChart
                            data={{
                                labels: analyticsData.labels,
                                datasets: [
                                    {
                                        data: analyticsData.caloriesTrend,
                                    },
                                ],
                            }}
                            width={chartWidth - 40}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                </View>

                {/* Protein Trend Chart */}
                <View style={styles.chartSection}>
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="fitness" size={24} color="#4CAF50" />
                            <Text style={styles.chartTitle}>Protein Intake</Text>
                        </View>
                        <Text style={styles.chartSubtitle}>
                            Daily protein consumption (grams)
                        </Text>
                        <LineChart
                            data={{
                                labels: analyticsData.labels,
                                datasets: [
                                    {
                                        data: analyticsData.proteinTrend,
                                    },
                                ],
                            }}
                            width={chartWidth - 40}
                            height={220}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                </View>

                {/* Water Intake Chart */}
                <View style={styles.chartSection}>
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="water" size={24} color="#2196F3" />
                            <Text style={styles.chartTitle}>Water Intake</Text>
                        </View>
                        <Text style={styles.chartSubtitle}>
                            Daily water consumption (glasses)
                        </Text>
                        <BarChart
                            data={{
                                labels: analyticsData.labels,
                                datasets: [
                                    {
                                        data: analyticsData.waterTrend,
                                    },
                                ],
                            }}
                            width={chartWidth - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                            showValuesOnTopOfBars
                        />
                    </View>
                </View>

                {/* Workout Frequency Chart */}
                <View style={styles.chartSection}>
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="barbell" size={24} color="#9C27B0" />
                            <Text style={styles.chartTitle}>Workout Activity</Text>
                        </View>
                        <Text style={styles.chartSubtitle}>
                            Calories burned per workout session
                        </Text>
                        <BarChart
                            data={{
                                labels: analyticsData.labels,
                                datasets: [
                                    {
                                        data: analyticsData.caloriesBurned,
                                    },
                                ],
                            }}
                            width={chartWidth - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                </View>

                {/* AI Insights */}
                <View style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb" size={24} color="#FFD700" />
                        <Text style={styles.insightTitle}>Performance Insights</Text>
                    </View>
                    <Text style={styles.insightText}>
                        {calorieProgress >= 0.9
                            ? "🎉 Great job! You're consistently meeting your calorie goals."
                            : "💪 Try to be more consistent with your calorie intake to reach your goals."}
                        {"\n\n"}
                        {proteinProgress >= 0.8
                            ? "✅ Excellent protein intake! Keep it up for muscle growth."
                            : "🥩 Consider increasing your protein intake to support your fitness goals."}
                        {"\n\n"}
                        {waterProgress >= 0.9
                            ? "💧 Perfect hydration! You're staying well hydrated."
                            : "💦 Remember to drink more water throughout the day."}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
