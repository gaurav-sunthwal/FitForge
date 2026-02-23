import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { useTheme } from "../constants/Colors";
import { api } from "../utils/api";

interface FitnessGoals {
    age: string;
    gender: string;
    height: string;
    currentWeight: string;
    targetWeight: string;
    targetCalories: string;
    weeklyWorkouts: string;
    workoutTypes: string[];
    geminiApiKey: string;
    fitnessObjective: string;
}

const OBJECTIVES = [
    { id: "lose", label: "Lose Weight", icon: "trending-down" },
    { id: "gain", label: "Build Muscle", icon: "barbell" },
    { id: "maintain", label: "Maintenance", icon: "git-commit" },
    { id: "athletic", label: "Athletic Performance", icon: "flash" },
];

export default function FitnessGoalsScreen() {
    const { colors } = useTheme();
    const [goals, setGoals] = useState<FitnessGoals>({
        age: "",
        gender: "male",
        height: "",
        currentWeight: "",
        targetWeight: "",
        targetCalories: "2000",
        weeklyWorkouts: "4",
        workoutTypes: [],
        geminiApiKey: "",
        fitnessObjective: "maintain",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasExistingKey, setHasExistingKey] = useState(false);

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
            marginBottom: 16,
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
        objectiveGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 8,
        },
        objectiveCard: {
            width: "48%",
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.border,
            gap: 8,
        },
        objectiveCardActive: {
            borderColor: colors.accent,
            backgroundColor: colors.accent + "10", // Tint
        },
        objectiveLabel: {
            fontSize: 13,
            color: colors.textPrimary,
            fontWeight: "600",
            textAlign: "center",
        },
        objectiveLabelActive: {
            color: colors.accent,
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
        genderToggle: {
            flexDirection: 'row',
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            padding: 4,
            gap: 4,
        },
        genderButton: {
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 8,
        },
        genderButtonActive: {
            backgroundColor: colors.accent,
        },
        genderText: {
            color: colors.textSecondary,
            fontWeight: '600',
        },
        genderTextActive: {
            color: '#FFF',
        },
        apiKeyStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#10B98120',
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
            gap: 8,
        },
        apiKeyStatusText: {
            color: '#10B981',
            fontSize: 13,
            fontWeight: '600',
        }
    });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const [goalsRes, profileRes] = await Promise.all([
                api.user.getGoals().catch(() => ({ success: false, data: null })),
                api.user.getProfile().catch(() => ({ success: false, data: null })),
            ]);

            const hasKey = !!profileRes.data?.geminiApiKey;
            setHasExistingKey(hasKey);

            const newGoals: FitnessGoals = {
                age: profileRes.data?.profile?.age?.toString() || "",
                gender: profileRes.data?.profile?.gender || "male",
                height: profileRes.data?.profile?.height?.toString() || "",
                currentWeight: profileRes.data?.profile?.weight?.toString() || goalsRes.data?.currentWeight?.toString() || "",
                targetWeight: "",
                targetCalories: goalsRes.data?.calorieTarget?.toString() || "2000",
                weeklyWorkouts: "4",
                workoutTypes: [],
                geminiApiKey: "", // Don't show existing key for security, just show status
                fitnessObjective: goalsRes.data?.fitnessGoal || "maintain",
            };

            setGoals(newGoals);
            await AsyncStorage.setItem("fitnessGoals", JSON.stringify(newGoals));
        } catch (error) {
            console.error("Error loading goals:", error);
            const savedGoals = await AsyncStorage.getItem("fitnessGoals");
            if (savedGoals) {
                setGoals(JSON.parse(savedGoals));
            }
        } finally {
            setLoading(false);
        }
    };

    const saveGoals = async () => {
        if (!hasExistingKey && !goals.geminiApiKey) {
            Alert.alert("API Key Required", "Please provide your Gemini API key to generate a workout plan.");
            return;
        }

        setSaving(true);
        try {
            // 1. Update Profile
            await api.user.updateProfile({
                age: parseInt(goals.age),
                gender: goals.gender,
                height: parseFloat(goals.height),
                weight: parseFloat(goals.currentWeight),
            });

            // 2. Update Goals & Objective
            await api.user.updateGoals({
                currentWeight: parseFloat(goals.currentWeight),
                calorieTarget: parseInt(goals.targetCalories),
                fitnessGoal: goals.fitnessObjective,
                proteinTarget: 150,
                carbsTarget: 200,
                fatsTarget: 70,
                waterTarget: 8,
            });

            // 3. Update API Key only if user typed a new one
            if (goals.geminiApiKey) {
                await api.ai.updateApiKey(goals.geminiApiKey);
            }

            // 4. Generate Weekly Plan
            Alert.alert("Generating Plan", "Our AI is crafting your " + OBJECTIVES.find(o => o.id === goals.fitnessObjective)?.label + " workout plan...");
            const planRes = await api.ai.generateWeeklyPlan();

            if (planRes.success) {
                await AsyncStorage.setItem("fitnessGoals", JSON.stringify(goals));
                Alert.alert("Success", "Your profile and custom workout plan are ready!");
                router.replace("/(tabs)");
            } else {
                throw new Error(planRes.message || "Failed to generate plan");
            }
        } catch (error: any) {
            console.error("Error saving goals:", error);
            Alert.alert("Error", `Failed to save: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={[styles.loadingText, { marginTop: 12 }]}>Syncing your profile...</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile Setup</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What's your primary goal?</Text>
                    <View style={styles.objectiveGrid}>
                        {OBJECTIVES.map((obj) => (
                            <TouchableOpacity
                                key={obj.id}
                                style={[
                                    styles.objectiveCard,
                                    goals.fitnessObjective === obj.id && styles.objectiveCardActive
                                ]}
                                onPress={() => setGoals(p => ({ ...p, fitnessObjective: obj.id }))}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={obj.icon as any}
                                    size={24}
                                    color={goals.fitnessObjective === obj.id ? colors.accent : colors.textTertiary}
                                />
                                <Text style={[
                                    styles.objectiveLabel,
                                    goals.fitnessObjective === obj.id && styles.objectiveLabelActive
                                ]}>
                                    {obj.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Age</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="25"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.age}
                                onChangeText={(text) => setGoals((prev) => ({ ...prev, age: text }))}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Gender</Text>
                            <View style={styles.genderToggle}>
                                <TouchableOpacity
                                    style={[styles.genderButton, goals.gender === 'male' && styles.genderButtonActive]}
                                    onPress={() => setGoals(p => ({ ...p, gender: 'male' }))}
                                >
                                    <Text style={[styles.genderText, goals.gender === 'male' && styles.genderTextActive]}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.genderButton, goals.gender === 'female' && styles.genderButtonActive]}
                                    onPress={() => setGoals(p => ({ ...p, gender: 'female' }))}
                                >
                                    <Text style={[styles.genderText, goals.gender === 'female' && styles.genderTextActive]}>Female</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="175"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.height}
                                onChangeText={(text) => setGoals((prev) => ({ ...prev, height: text }))}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="70"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.currentWeight}
                                onChangeText={(text) => setGoals((prev) => ({ ...prev, currentWeight: text }))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Daily Targets</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Calorie Goal</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="2000"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.targetCalories}
                                onChangeText={(text) => setGoals((prev) => ({ ...prev, targetCalories: text }))}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Workout Days</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="4"
                                placeholderTextColor={colors.textTertiary}
                                value={goals.weeklyWorkouts}
                                onChangeText={(text) => setGoals((prev) => ({ ...prev, weeklyWorkouts: text }))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Brain (Gemini)</Text>
                    {hasExistingKey && (
                        <View style={styles.apiKeyStatus}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />

                            <Text style={styles.apiKeyStatusText}>API Key is already configured</Text>
                        </View>
                    )}
                    <View style={{ marginTop: 12 }}>
                        <Text style={styles.inputLabel}>{hasExistingKey ? "Update API Key (Optional)" : "Gemini API Key"}</Text>
                        <TextInput
                            style={[styles.input, { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }]}
                            placeholder={hasExistingKey ? "Paste new key to update" : "Paste your Gemini API key here"}
                            placeholderTextColor={colors.textTertiary}
                            value={goals.geminiApiKey}
                            onChangeText={(text) => setGoals((prev) => ({ ...prev, geminiApiKey: text }))}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                        <Text style={styles.helperText}>
                            {!hasExistingKey
                                ? "Required to generate your high-performance workout plan."
                                : "Leave empty to keep your existing key."
                            }
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, saving && { opacity: 0.7 }]}
                    onPress={saveGoals}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color={colors.textWhite} />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            {hasExistingKey ? "Regenerate Workout Plan" : "Generate My Plan"}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
