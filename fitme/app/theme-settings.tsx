import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemeMode, useTheme } from "../constants/Colors";
import { api } from "../utils/api";

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
    {
        id: "light",
        label: "Light Mode",
        icon: "sunny",
        description: "Always use light theme",
    },
    {
        id: "dark",
        label: "Dark Mode",
        icon: "moon",
        description: "Always use dark theme",
    },
    {
        id: "system",
        label: "System",
        icon: "phone-portrait",
        description: "Follow system settings",
    },
];

export default function ThemeSettingsScreen() {
    const { theme, colors, setTheme } = useTheme();

    const handleSetTheme = async (mode: ThemeMode) => {
        setTheme(mode);
        try {
            await api.user.updateSettings({ theme: mode });
        } catch (error) {
            console.error("Error updating theme setting on backend:", error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Theme Settings
                </Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Choose Theme
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Select your preferred theme for the app
                </Text>

                <View style={styles.optionsContainer}>
                    {THEME_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                {
                                    backgroundColor: colors.cardBackground,
                                    borderColor: theme === option.id ? colors.accent : colors.border,
                                    borderWidth: theme === option.id ? 2 : 1,
                                },
                            ]}
                            onPress={() => handleSetTheme(option.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionLeft}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor:
                                                theme === option.id
                                                    ? colors.accent
                                                    : colors.iconBackground,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={option.icon}
                                        size={28}
                                        color={
                                            theme === option.id
                                                ? colors.textWhite
                                                : colors.textPrimary
                                        }
                                    />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            { color: colors.textPrimary },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.optionDescription,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        {option.description}
                                    </Text>
                                </View>
                            </View>
                            {theme === option.id && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={colors.accent}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Preview Section */}
                <View style={styles.previewSection}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        Preview
                    </Text>
                    <View
                        style={[
                            styles.previewCard,
                            { backgroundColor: colors.cardBackground },
                        ]}
                    >
                        <View style={styles.previewHeader}>
                            <View
                                style={[
                                    styles.previewAvatar,
                                    { backgroundColor: colors.iconBackground },
                                ]}
                            >
                                <Ionicons
                                    name="person"
                                    size={24}
                                    color={colors.textSecondary}
                                />
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styles.previewName,
                                        { color: colors.textPrimary },
                                    ]}
                                >
                                    Your Name
                                </Text>
                                <Text
                                    style={[
                                        styles.previewEmail,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    your.email@example.com
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.previewStats,
                                { backgroundColor: colors.iconBackground },
                            ]}
                        >
                            <View style={styles.previewStat}>
                                <Ionicons
                                    name="flame"
                                    size={20}
                                    color={colors.accent}
                                />
                                <Text
                                    style={[
                                        styles.previewStatText,
                                        { color: colors.textPrimary },
                                    ]}
                                >
                                    7 Day Streak
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    headerRight: {
        width: 40,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 24,
        lineHeight: 20,
    },
    optionsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 16,
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
    },
    previewSection: {
        marginTop: 16,
    },
    previewCard: {
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
    },
    previewHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    previewAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    previewName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    previewEmail: {
        fontSize: 14,
    },
    previewStats: {
        borderRadius: 12,
        padding: 12,
    },
    previewStat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    previewStatText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
