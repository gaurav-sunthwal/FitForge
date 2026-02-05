import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../constants/Colors";

interface ApiKeyModalProps {
    visible: boolean;
    onClose: () => void;
    currentApiKey: string;
    onSave: (key: string) => void;
}

export default function ApiKeyModal({ visible, onClose, currentApiKey, onSave }: ApiKeyModalProps) {
    const { colors } = useTheme();
    const [tempApiKey, setTempApiKey] = useState(currentApiKey);

    const handleSave = async () => {
        if (tempApiKey.trim()) {
            try {
                await AsyncStorage.setItem("geminiApiKey", tempApiKey);
                onSave(tempApiKey);
                onClose();
                Alert.alert("Success", "Gemini API Key saved successfully!");
            } catch (error) {
                Alert.alert("Error", "Failed to save API key. Please try again.");
            }
        } else {
            Alert.alert("Error", "Please enter a valid API key");
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                            AI Settings
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <View style={[styles.infoCard, { backgroundColor: colors.iconBackground }]}>
                            <Ionicons name="sparkles" size={24} color={colors.accent} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                Add your Gemini API key to unlock AI-powered workout
                                recommendations and personalized fitness insights.
                            </Text>
                        </View>

                        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                            Gemini API Key
                        </Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.iconBackground, color: colors.textPrimary }]}
                            placeholder="Enter your Gemini API key"
                            placeholderTextColor={colors.textTertiary}
                            value={tempApiKey}
                            onChangeText={setTempApiKey}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() =>
                                Alert.alert(
                                    "Get API Key",
                                    "Visit https://makersuite.google.com/app/apikey to get your Gemini API key"
                                )
                            }
                        >
                            <Text style={[styles.linkText, { color: colors.accent }]}>
                                How to get an API key?
                            </Text>
                            <Ionicons name="open-outline" size={16} color={colors.accent} />
                        </TouchableOpacity>

                        {currentApiKey && (
                            <View style={styles.currentKeyContainer}>
                                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                                <Text style={styles.currentKeyText}>
                                    API key is currently configured
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { backgroundColor: colors.iconBackground }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.accent }]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.saveButtonText, { color: colors.textWhite }]}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        maxHeight: "85%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    modalBody: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    infoCard: {
        flexDirection: "row",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 12,
    },
    linkButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
    },
    linkText: {
        fontSize: 14,
        fontWeight: "600",
    },
    currentKeyContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#F0FDF4",
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
    },
    currentKeyText: {
        fontSize: 14,
        color: "#166534",
        fontWeight: "500",
    },
    modalFooter: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    cancelButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
