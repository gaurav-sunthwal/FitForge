import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../constants/Colors";
import { api } from "../utils/api";

export default function AISettingsScreen() {
    const { colors } = useTheme();
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await api.user.getProfile();
            if (response.success && response.data?.geminiApiKey) {
                setApiKey(response.data.geminiApiKey);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestApiKey = async () => {
        if (!apiKey.trim()) {
            Alert.alert("Error", "Please enter an API key first");
            return;
        }

        setTesting(true);
        try {
            // Test the key
            const response = await api.ai.testApiKey(apiKey);

            if (response.success) {
                // Automatically save the API key after successful test
                const saveResponse = await api.user.updateSettings({ geminiApiKey: apiKey });

                if (saveResponse.success) {
                    Alert.alert(
                        "✅ Success!",
                        "API key is valid and has been saved successfully!",
                        [{
                            text: "Great!",
                            style: "default",
                            onPress: () => router.back()
                        }]
                    );
                } else {
                    // Test passed but save failed
                    Alert.alert(
                        "⚠️ Partial Success",
                        "API key is valid but failed to save. Please try the Save button.",
                        [{ text: "OK", style: "default" }]
                    );
                }
            } else {
                const errorMsg = response.details || response.message || "API key might be invalid";
                Alert.alert("❌ Test Failed", errorMsg);
            }
        } catch (error: any) {
            console.error("Test error:", error);
            const errorMsg = error.message || "Failed to test API key. Please check if it's valid.";
            Alert.alert("❌ Test Failed", errorMsg);
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.user.updateSettings({ geminiApiKey: apiKey });
            if (response.success) {
                Alert.alert("Success", "API key saved successfully!");
                router.back();
            } else {
                Alert.alert("Error", response.message || "Failed to save API key");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to save API key");
        } finally {
            setSaving(false);
        }
    };

    const handleGetApiKey = () => {
        Linking.openURL("https://aistudio.google.com/app/apikey");
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

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
                    AI Settings
                </Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.accent + "20" }]}>
                        <Ionicons name="sparkles" size={32} color={colors.accent} />
                    </View>
                    <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                        Add your Gemini API key to unlock AI-powered workout recommendations and
                        personalized fitness insights.
                    </Text>
                </View>

                {/* API Key Input */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        Gemini API Key
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                        Your API key is stored securely and never shared
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.cardBackground,
                                color: colors.textPrimary,
                                borderColor: colors.border,
                            },
                        ]}
                        placeholder="Enter your Gemini API key"
                        placeholderTextColor={colors.textLight}
                        value={apiKey}
                        onChangeText={setApiKey}
                        secureTextEntry={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Test Button */}
                    <TouchableOpacity
                        style={[
                            styles.testButton,
                            {
                                backgroundColor: colors.cardBackground,
                                borderColor: colors.accent,
                            },
                        ]}
                        onPress={handleTestApiKey}
                        disabled={testing || !apiKey.trim()}
                    >
                        {testing ? (
                            <ActivityIndicator size="small" color={colors.accent} />
                        ) : (
                            <>
                                <Ionicons name="flask" size={20} color={colors.accent} />
                                <Text style={[styles.testButtonText, { color: colors.accent }]}>
                                    Test API Key
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* How to get API key */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        How to get an API key?
                    </Text>
                    <View style={[styles.stepCard, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.step}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                                <Text style={[styles.stepNumberText, { color: colors.textWhite }]}>
                                    1
                                </Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                                Visit Google AI Studio
                            </Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                                <Text style={[styles.stepNumberText, { color: colors.textWhite }]}>
                                    2
                                </Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                                Sign in with your Google account
                            </Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                                <Text style={[styles.stepNumberText, { color: colors.textWhite }]}>
                                    3
                                </Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                                Click "Get API Key" and create a new key
                            </Text>
                        </View>
                        <View style={styles.step}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                                <Text style={[styles.stepNumberText, { color: colors.textWhite }]}>
                                    4
                                </Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                                Copy and paste the key above
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.linkButton, { backgroundColor: colors.iconBackground }]}
                            onPress={handleGetApiKey}
                        >
                            <Ionicons name="open-outline" size={20} color={colors.accent} />
                            <Text style={[styles.linkButtonText, { color: colors.accent }]}>
                                Open Google AI Studio
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor: apiKey.trim() ? colors.accent : colors.border,
                        },
                    ]}
                    onPress={handleSave}
                    disabled={saving || !apiKey.trim()}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color={colors.textWhite} />
                    ) : (
                        <Text style={[styles.saveButtonText, { color: colors.textWhite }]}>
                            Save API Key
                        </Text>
                    )}
                </TouchableOpacity>
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
    infoCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: "center",
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        lineHeight: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontWeight: "500",
        borderWidth: 1,
        marginBottom: 12,
    },
    testButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    testButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    stepCard: {
        borderRadius: 16,
        padding: 20,
        gap: 16,
    },
    step: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: "700",
    },
    stepText: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
    },
    linkButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 12,
        gap: 8,
        marginTop: 8,
    },
    linkButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },
    saveButton: {
        borderRadius: 12,
        padding: 18,
        alignItems: "center",
        marginTop: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
