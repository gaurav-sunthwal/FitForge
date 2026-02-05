import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useTheme } from "../../constants/Colors";
import { api } from "../../utils/api";

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    time: string;
    imageUri?: string;
}

export default function CaloriesScreen() {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 20,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "ios" ? 60 : 40,
            paddingBottom: 20,
        },
        headerTitle: {
            fontSize: 32,
            fontWeight: "800",
            color: colors.textPrimary,
            marginBottom: 4,
        },
        headerDate: {
            fontSize: 16,
            color: colors.textSecondary,
            fontWeight: "500",
        },
        progressSection: {
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 20,
            marginBottom: 30,
        },
        progressRing: {
            alignItems: "center",
            marginBottom: 12,
        },
        ringContent: {
            alignItems: "center",
        },
        ringValue: {
            fontSize: 28,
            fontWeight: "800",
            color: colors.textPrimary,
        },
        ringGoal: {
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: "600",
        },
        ringLabel: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 4,
        },
        ringSubLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: "500",
        },
        waterSection: {
            marginHorizontal: 20,
            marginBottom: 30,
            padding: 20,
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        waterHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
        },
        waterTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: colors.textPrimary,
            marginLeft: 8,
            flex: 1,
        },
        waterCount: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.textSecondary,
        },
        waterGlasses: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
        },
        glassButton: {
            padding: 4,
        },
        waterProgressBar: {
            height: 6,
            backgroundColor: colors.border,
            borderRadius: 3,
            overflow: "hidden",
        },
        waterProgressFill: {
            height: "100%",
            backgroundColor: "#2196F3",
            borderRadius: 3,
        },
        waterCounter: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            gap: 20,
        },
        waterButton: {
            padding: 4,
        },
        waterDisplay: {
            alignItems: "center",
            minWidth: 120,
        },
        waterValue: {
            fontSize: 36,
            fontWeight: "800",
            color: "#2196F3",
        },
        waterGoalText: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.textSecondary,
            marginTop: 4,
        },
        glassIcon: {
            padding: 2,
        },
        waterSubtext: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.textSecondary,
            textAlign: "center",
            marginTop: 12,
        },
        addFoodSection: {
            marginHorizontal: 20,
            marginBottom: 30,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 16,
        },
        addFoodButtons: {
            flexDirection: "row",
            gap: 12,
        },
        addFoodButton: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        addFoodIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.iconBackground,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
        },
        addFoodButtonText: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 4,
        },
        addFoodButtonSubText: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: "500",
        },
        foodLogSection: {
            marginHorizontal: 20,
        },
        emptyState: {
            alignItems: "center",
            paddingVertical: 40,
        },
        emptyStateText: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.textSecondary,
            marginTop: 12,
        },
        emptyStateSubText: {
            fontSize: 14,
            color: colors.textTertiary,
            marginTop: 4,
        },
        foodItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
        },
        foodItemLeft: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        foodItemIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.iconBackground,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        foodItemInfo: {
            flex: 1,
        },
        foodItemName: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.textPrimary,
            marginBottom: 4,
        },
        foodItemTime: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: "500",
        },
        foodItemRight: {
            flexDirection: "row",
            alignItems: "center",
        },
        foodItemStats: {
            alignItems: "flex-end",
            marginRight: 12,
        },
        foodItemCalories: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.accent,
            marginBottom: 2,
        },
        foodItemProtein: {
            fontSize: 12,
            fontWeight: "600",
            color: "#4CAF50",
        },
        deleteButton: {
            padding: 8,
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
            paddingTop: 20,
            paddingBottom: Platform.OS === "ios" ? 40 : 20,
            paddingHorizontal: 20,
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: "800",
            color: colors.textPrimary,
        },
        modalForm: {
            gap: 20,
        },
        inputGroup: {
            gap: 8,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.textSecondary,
        },
        input: {
            backgroundColor: colors.iconBackground,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: "500",
        },
        inputRow: {
            flexDirection: "row",
        },
        addButton: {
            backgroundColor: colors.accent,
            borderRadius: 12,
            padding: 18,
            alignItems: "center",
            marginTop: 8,
        },
        addButtonText: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.textWhite,
        },
    });

    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [proteinConsumed, setProteinConsumed] = useState(0);
    const [waterGlasses, setWaterGlasses] = useState(0);
    const [foodLog, setFoodLog] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Daily goals
    const [goals, setGoals] = useState({
        caloriesGoal: 2000,
        proteinGoal: 150,
        waterGoal: 8,
    });

    useEffect(() => {
        fetchDailyData();
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await api.user.getGoals();
            if (response.success && response.data) {
                setGoals({
                    caloriesGoal: response.data.calorieTarget || 2000,
                    proteinGoal: response.data.proteinTarget || 150,
                    waterGoal: response.data.waterTarget || 8,
                });
            }
        } catch (error) {
            console.error("Error loading goals:", error);
        }
    };

    const fetchDailyData = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split("T")[0];
            const response = await api.nutrition.getDaily(today);

            if (response.success && response.data) {
                const { foodLogs, waterLogs, stats } = response.data;

                setCaloriesConsumed(stats.totalCalories || 0);
                setProteinConsumed(stats.totalProtein || 0);
                setWaterGlasses(stats.totalWater || 0);

                const formattedLogs = foodLogs.map((log: any) => ({
                    id: log.id,
                    name: log.foodName,
                    calories: log.calories,
                    protein: log.protein,
                    time: new Date(log.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                    }),
                }));
                setFoodLog(formattedLogs);
            }
        } catch (error) {
            console.error("Error fetching daily data:", error);
        } finally {
            setLoading(false);
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [foodName, setFoodName] = useState("");
    const [foodCalories, setFoodCalories] = useState("");
    const [foodProtein, setFoodProtein] = useState("");

    // Calculate percentages
    const caloriesPercentage = Math.min((caloriesConsumed / goals.caloriesGoal) * 100, 100);
    const proteinPercentage = Math.min((proteinConsumed / goals.proteinGoal) * 100, 100);
    const waterPercentage = Math.min((waterGlasses / goals.waterGoal) * 100, 100);

    const handleAddFood = async () => {
        if (!foodName || !foodCalories || !foodProtein) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            const data = {
                foodName,
                calories: parseInt(foodCalories),
                protein: parseInt(foodProtein),
                carbs: 0,
                fats: 0,
            };

            const response = await api.nutrition.logFood(data);
            if (response.success) {
                const newFood: FoodItem = {
                    id: response.data.id || Date.now().toString(),
                    name: foodName,
                    calories: parseInt(foodCalories),
                    protein: parseInt(foodProtein),
                    time: new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                    }),
                };

                setFoodLog([newFood, ...foodLog]);
                setCaloriesConsumed(caloriesConsumed + parseInt(foodCalories));
                setProteinConsumed(proteinConsumed + parseInt(foodProtein));

                // Reset form
                setFoodName("");
                setFoodCalories("");
                setFoodProtein("");
                setModalVisible(false);
            }
        } catch (error: any) {
            Alert.alert("Error", `Failed to log food: ${error.message}`);
        }
    };

    const handleUpdateWater = async (increment: boolean) => {
        const newValue = increment ? waterGlasses + 1 : Math.max(0, waterGlasses - 1);
        try {
            await api.nutrition.logWater(increment ? 1 : -1);
            setWaterGlasses(newValue);
        } catch (error: any) {
            console.error("Error updating water:", error);
        }
    };

    const handleTakePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Camera permission is required to take photos");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                setIsAnalyzing(true);
                const response = await api.ai.analyzeMeal(result.assets[0].base64);
                setIsAnalyzing(false);

                if (response.success && response.data) {
                    const { foodName, calories, protein } = response.data;
                    setFoodName(foodName);
                    setFoodCalories(calories.toString());
                    setFoodProtein(protein.toString());
                    setModalVisible(true);
                } else {
                    Alert.alert("Error", "Failed to analyze meal. Please try again or add manually.");
                    setModalVisible(true);
                }
            }
        } catch (error: any) {
            setIsAnalyzing(false);
            Alert.alert("Error", "Failed to process image. Please try again.");
        }
    };

    const handleDeleteFood = async (id: string) => {
        try {
            const response = await api.nutrition.deleteFood(id);
            if (response.success) {
                const foodToDelete = foodLog.find((item) => item.id === id);
                if (foodToDelete) {
                    setCaloriesConsumed(caloriesConsumed - foodToDelete.calories);
                    setProteinConsumed(proteinConsumed - foodToDelete.protein);
                    setFoodLog(foodLog.filter((item) => item.id !== id));
                }
            }
        } catch (error: any) {
            Alert.alert("Error", `Failed to delete: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Nutrition Tracker</Text>
                    <Text style={styles.headerDate}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                        })}
                    </Text>
                </View>

                {/* Progress Rings */}
                <View style={styles.progressSection}>
                    <View style={styles.progressRing}>
                        <AnimatedCircularProgress
                            size={150}
                            width={12}
                            fill={caloriesPercentage}
                            tintColor={colors.accent}
                            backgroundColor={colors.border}
                            rotation={0}
                            lineCap="round"
                            duration={1000}
                        >
                            {() => (
                                <View style={styles.ringContent}>
                                    <Text style={styles.ringValue}>{caloriesConsumed}</Text>
                                    <Text style={styles.ringGoal}>/ {goals.caloriesGoal}</Text>
                                </View>
                            )}
                        </AnimatedCircularProgress>
                        <Text style={styles.ringLabel}>Calories</Text>
                        <Text style={styles.ringSubLabel}>
                            {goals.caloriesGoal - caloriesConsumed > 0
                                ? `${goals.caloriesGoal - caloriesConsumed} remaining`
                                : "Goal reached!"}
                        </Text>
                    </View>

                    <View style={styles.progressRing}>
                        <AnimatedCircularProgress
                            size={150}
                            width={12}
                            fill={proteinPercentage}
                            tintColor="#4CAF50"
                            backgroundColor={colors.border}
                            rotation={0}
                            lineCap="round"
                            duration={1000}
                        >
                            {() => (
                                <View style={styles.ringContent}>
                                    <Text style={styles.ringValue}>{proteinConsumed}g</Text>
                                    <Text style={styles.ringGoal}>/ {goals.proteinGoal}g</Text>
                                </View>
                            )}
                        </AnimatedCircularProgress>
                        <Text style={styles.ringLabel}>Protein</Text>
                        <Text style={styles.ringSubLabel}>
                            {goals.proteinGoal - proteinConsumed > 0
                                ? `${goals.proteinGoal - proteinConsumed}g remaining`
                                : "Goal reached!"}
                        </Text>
                    </View>
                </View>

                {/* Water Tracker */}
                <View style={styles.waterSection}>
                    <View style={styles.waterHeader}>
                        <Ionicons name="water" size={24} color="#2196F3" />
                        <Text style={styles.waterTitle}>Water Intake</Text>
                    </View>

                    <View style={styles.waterCounter}>
                        <TouchableOpacity
                            style={styles.waterButton}
                            onPress={() => handleUpdateWater(false)}
                            disabled={waterGlasses === 0}
                        >
                            <Ionicons
                                name="remove-circle"
                                size={40}
                                color={waterGlasses === 0 ? colors.textLight : "#2196F3"}
                            />
                        </TouchableOpacity>

                        <View style={styles.waterDisplay}>
                            <Text style={styles.waterValue}>{waterGlasses}</Text>
                            <Text style={styles.waterGoalText}>/ {goals.waterGoal} glasses</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.waterButton}
                            onPress={() => handleUpdateWater(true)}
                            disabled={waterGlasses === goals.waterGoal}
                        >
                            <Ionicons
                                name="add-circle"
                                size={40}
                                color={waterGlasses === goals.waterGoal ? colors.textLight : "#2196F3"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.waterGlasses}>
                        {[...Array(goals.waterGoal)].map((_, index) => (
                            <View key={index} style={styles.glassIcon}>
                                <Ionicons
                                    name={index < waterGlasses ? "water" : "water-outline"}
                                    size={28}
                                    color={index < waterGlasses ? "#2196F3" : colors.textLight}
                                />
                            </View>
                        ))}
                    </View>

                    <View style={styles.waterProgressBar}>
                        <View
                            style={[
                                styles.waterProgressFill,
                                { width: `${waterPercentage}%` },
                            ]}
                        />
                    </View>

                    <Text style={styles.waterSubtext}>
                        {waterGlasses === goals.waterGoal
                            ? "🎉 Daily goal reached!"
                            : `${goals.waterGoal - waterGlasses} more glass${goals.waterGoal - waterGlasses !== 1 ? "es" : ""} to go`}
                    </Text>
                </View>

                {/* Add Food Buttons */}
                <View style={styles.addFoodSection}>
                    <Text style={styles.sectionTitle}>Add Food</Text>
                    <View style={styles.addFoodButtons}>
                        <TouchableOpacity
                            style={styles.addFoodButton}
                            onPress={handleTakePhoto}
                        >
                            <View style={styles.addFoodIconContainer}>
                                <Ionicons name="camera" size={28} color={colors.accent} />
                            </View>
                            <Text style={styles.addFoodButtonText}>Take Photo</Text>
                            <Text style={styles.addFoodButtonSubText}>AI Analysis</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.addFoodButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <View style={styles.addFoodIconContainer}>
                                <Ionicons name="add-circle" size={28} color="#4CAF50" />
                            </View>
                            <Text style={styles.addFoodButtonText}>Add Manually</Text>
                            <Text style={styles.addFoodButtonSubText}>Enter details</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Food Log */}
                <View style={styles.foodLogSection}>
                    <Text style={styles.sectionTitle}>Today's Food Log</Text>
                    {foodLog.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="restaurant-outline" size={48} color={colors.textLight} />
                            <Text style={styles.emptyStateText}>No food logged yet</Text>
                            <Text style={styles.emptyStateSubText}>
                                Start tracking your meals
                            </Text>
                        </View>
                    ) : (
                        foodLog.map((item) => (
                            <View key={item.id} style={styles.foodItem}>
                                <View style={styles.foodItemLeft}>
                                    <View style={styles.foodItemIcon}>
                                        <Ionicons
                                            name="restaurant"
                                            size={20}
                                            color={colors.accent}
                                        />
                                    </View>
                                    <View style={styles.foodItemInfo}>
                                        <Text style={styles.foodItemName}>{item.name}</Text>
                                        <Text style={styles.foodItemTime}>{item.time}</Text>
                                    </View>
                                </View>
                                <View style={styles.foodItemRight}>
                                    <View style={styles.foodItemStats}>
                                        <Text style={styles.foodItemCalories}>
                                            {item.calories} cal
                                        </Text>
                                        <Text style={styles.foodItemProtein}>
                                            {item.protein}g protein
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteFood(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={20}
                                            color="#F44336"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Add Food Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Food Item</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={28} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Food Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Grilled Chicken"
                                    placeholderTextColor={colors.textLight}
                                    value={foodName}
                                    onChangeText={setFoodName}
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.inputLabel}>Calories</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        placeholderTextColor={colors.textLight}
                                        value={foodCalories}
                                        onChangeText={setFoodCalories}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.inputLabel}>Protein (g)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        placeholderTextColor={colors.textLight}
                                        value={foodProtein}
                                        onChangeText={setFoodProtein}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddFood}
                            >
                                <Text style={styles.addButtonText}>Add to Log</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


