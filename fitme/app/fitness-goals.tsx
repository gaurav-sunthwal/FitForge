import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../constants/Colors";
import { api } from "../utils/api";

interface FitnessGoals {
    currentWeight: string;
    targetWeight: string;
    targetCalories: string;
    weeklyWorkouts: string;
    workoutTypes: string[];
}

const WORKOUT_TYPES = [
    { id: "cardio", label: "Cardio", icon: "bicycle" },
    { id: "strength", label: "Strength Training", icon: "barbell" },
    { id: "yoga", label: "Yoga", icon: "body" },
    { id: "hiit", label: "HIIT", icon: "flash" },
    { id: "pilates", label: "Pilates", icon: "fitness" },
    { id: "swimming", label: "Swimming", icon: "water" },
];

export default function FitnessGoalsScreen() {
    const { colors } = useTheme();
    const [goals, setGoals] = useState<FitnessGoals>({
        currentWeight: "",
        targetWeight: "",
        targetCalories: "2000",
        weeklyWorkouts: "4",
        workoutTypes: [],
    });
    const [loading, setLoading] = useState(true);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        loadingText: {
            fontSize: 16,
            color: colors.textSecondary,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 20,
            backgroundColor: colors.background,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.cardBackground,
            justifyContent: "center",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "700",
        },
        headerRight: {
            width: 40,
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 40,
        },
        section: {
            marginBottom: 32,
        },
        sectionTitle: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: "700",
            marginBottom: 16,
        },
        inputRow: {
            flexDirection: "row",
            gap: 12,
        },
        inputContainer: {
            flex: 1,
        },
        inputLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: "600",
            marginBottom: 8,
        },
        input: {
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.textPrimary,
            borderWidth: 1,
            borderColor: colors.border,
        },
        helperText: {
            fontSize: 12,
            color: colors.textTertiary,
            marginTop: 8,
            lineHeight: 18,
        },
        workoutTypesGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 12,
        },
        workoutTypeCard: {
            width: "48%",
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.border,
            position: "relative",
        },
        workoutTypeCardActive: {
            backgroundColor: colors.accent,
            borderColor: colors.accent,
        },
        workoutTypeLabel: {
            fontSize: 14,
            color: colors.textPrimary,
            fontWeight: "600",
            marginTop: 8,
            textAlign: "center",
        },
        workoutTypeLabelActive: {
            color: colors.textWhite,
        },
        checkmark: {
            position: "absolute",
            top: 8,
            right: 8,
        },
        saveButton: {
            backgroundColor: colors.accent,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            marginTop: 16,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        saveButtonText: {
            fontSize: 16,
            color: colors.textWhite,
            fontWeight: "700",
        },
    });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            // Try loading from backend
            try {
                const response = await api.user.getGoals();
                if (response.success && response.data) {
                    const data = response.data;
                    const newGoals = {
                        currentWeight: data.currentWeight?.toString() || "",
                        targetWeight: "", // Not in schema, keeping for UI
                        targetCalories: data.calorieTarget?.toString() || "2000",
                        weeklyWorkouts: "4", // Default as not in schema
                        workoutTypes: [], // Not explicitly in schema
                    };
                    setGoals(newGoals);
                    await AsyncStorage.setItem("fitnessGoals", JSON.stringify(newGoals));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log("Backend goals load failed, falling back to local storage");
            }

            // Fallback
            const savedGoals = await AsyncStorage.getItem("fitnessGoals");
            if (savedGoals) {
                setGoals(JSON.parse(savedGoals));
            }
        } catch (error) {
            console.error("Error loading goals:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveGoals = async () => {
        try {
            // Save to backend
            const response = await api.user.updateGoals({
                currentWeight: parseFloat(goals.currentWeight),
                calorieTarget: parseInt(goals.targetCalories),
                proteinTarget: 150, // Default or calculated
                carbsTarget: 200,
                fatsTarget: 70,
                waterTarget: 8,
            });

            if (response.success) {
                await AsyncStorage.setItem("fitnessGoals", JSON.stringify(goals));
                Alert.alert("Success", "Your fitness goals have been saved!");
                router.back();
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error("Error saving goals:", error);
            Alert.alert("Error", `Failed to save goals: ${error.message}`);
        }
    };

    const toggleWorkoutType = (typeId: string) => {
        setGoals((prev) => ({
            ...prev,
            workoutTypes: prev.workoutTypes.includes(typeId)
                ? prev.workoutTypes.filter((id) => id !== typeId)
                : [...prev.workoutTypes, typeId],
        }));
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fitness Goals</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Weight Goals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weight Goals</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Current Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="70"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.currentWeight}
                                onChangeText={(text) =>
                                    setGoals((prev) => ({ ...prev, currentWeight: text }))
                                }
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Target Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="65"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.targetWeight}
                                onChangeText={(text) =>
                                    setGoals((prev) => ({ ...prev, targetWeight: text }))
                                }
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Calorie Goals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Daily Calorie Target</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2000"
                        placeholderTextColor={colors.textTertiary}
                        value={goals.targetCalories}
                        onChangeText={(text) =>
                            setGoals((prev) => ({ ...prev, targetCalories: text }))
                        }
                        keyboardType="numeric"
                    />
                    <Text style={styles.helperText}>
                        Recommended: 1800-2500 calories for most adults
                    </Text>
                </View>

                {/* Weekly Workout Goals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weekly Workout Goal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="4"
                        placeholderTextColor={colors.textTertiary}
                        value={goals.weeklyWorkouts}
                        onChangeText={(text) =>
                            setGoals((prev) => ({ ...prev, weeklyWorkouts: text }))
                        }
                        keyboardType="numeric"
                    />
                    <Text style={styles.helperText}>
                        How many days per week do you want to work out?
                    </Text>
                </View>

                {/* Workout Types */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferred Workout Types</Text>
                    <Text style={styles.helperText}>Select all that apply</Text>
                    <View style={styles.workoutTypesGrid}>
                        {WORKOUT_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.workoutTypeCard,
                                    goals.workoutTypes.includes(type.id) &&
                                    styles.workoutTypeCardActive,
                                ]}
                                onPress={() => toggleWorkoutType(type.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={type.icon as any}
                                    size={28}
                                    color={
                                        goals.workoutTypes.includes(type.id)
                                            ? colors.textWhite
                                            : colors.textPrimary
                                    }
                                />
                                <Text
                                    style={[
                                        styles.workoutTypeLabel,
                                        goals.workoutTypes.includes(type.id) &&
                                        styles.workoutTypeLabelActive,
                                    ]}
                                >
                                    {type.label}
                                </Text>
                                {goals.workoutTypes.includes(type.id) && (
                                    <View style={styles.checkmark}>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color={colors.textWhite}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={saveGoals}>
                    <Text style={styles.saveButtonText}>Save Goals</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
