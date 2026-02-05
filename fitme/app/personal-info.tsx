import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../constants/Colors";
import { api } from "../utils/api";

interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    age: string;
    height: string;
    gender: string;
    profileImage: string | null;
}

const GENDERS = ["Male", "Female", "Other"];

export default function PersonalInfoScreen() {
    const { colors } = useTheme();
    const [info, setInfo] = useState<PersonalInfo>({
        name: "",
        email: "",
        phone: "",
        age: "",
        height: "",
        gender: "",
        profileImage: null,
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
        photoSection: {
            alignItems: "center",
            marginBottom: 32,
        },
        profileImageContainer: {
            position: "relative",
            marginBottom: 12,
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.cardBackground,
        },
        profileImagePlaceholder: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.iconBackground,
            justifyContent: "center",
            alignItems: "center",
        },
        editBadge: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.accent,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 3,
            borderColor: colors.background,
        },
        photoHint: {
            fontSize: 12,
            color: colors.textTertiary,
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
        inputGroup: {
            marginBottom: 16,
        },
        inputRow: {
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
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
        genderContainer: {
            flexDirection: "row",
            gap: 12,
        },
        genderButton: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.border,
        },
        genderButtonActive: {
            backgroundColor: colors.accent,
            borderColor: colors.accent,
        },
        genderButtonText: {
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: "600",
        },
        genderButtonTextActive: {
            color: colors.textWhite,
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
        loadPersonalInfo();
    }, []);

    const loadPersonalInfo = async () => {
        try {
            // First try to load from backend
            try {
                const response = await api.user.getProfile();
                if (response.success && response.data) {
                    const userData = response.data;
                    const profileData = userData.profile || {};
                    const newInfo = {
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: "", // Not in schema, keeping for UI
                        age: profileData.age?.toString() || "",
                        height: profileData.height?.toString() || "",
                        gender: profileData.gender || "",
                        profileImage: userData.imageUrl || null,
                    };
                    setInfo(newInfo);
                    await AsyncStorage.setItem("personalInfo", JSON.stringify(newInfo));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log("Backend profile load failed, falling back to local storage");
            }

            // Fallback to local storage
            const savedInfo = await AsyncStorage.getItem("personalInfo");
            if (savedInfo) {
                setInfo(JSON.parse(savedInfo));
            }
        } catch (error) {
            console.error("Error loading personal info:", error);
        } finally {
            setLoading(false);
        }
    };

    const savePersonalInfo = async () => {
        if (!info.name || !info.email) {
            Alert.alert("Error", "Please fill in at least your name and email");
            return;
        }

        try {
            // Save to backend
            const response = await api.user.updateProfile({
                name: info.name,
                email: info.email,
                age: parseInt(info.age),
                height: parseFloat(info.height),
                gender: info.gender,
                profileImage: info.profileImage,
            });

            if (response.success) {
                await AsyncStorage.setItem("personalInfo", JSON.stringify(info));
                Alert.alert("Success", "Your personal information has been saved!");
                router.replace("/(tabs)");
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error("Error saving profile:", error);
            Alert.alert("Error", `Failed to save information: ${error.message}`);
        }
    };

    const pickProfileImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setInfo((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
        }
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
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Photo */}
                <View style={styles.photoSection}>
                    <TouchableOpacity
                        style={styles.profileImageContainer}
                        onPress={pickProfileImage}
                    >
                        {info.profileImage ? (
                            <Image
                                source={{ uri: info.profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Ionicons name="person" size={48} color={colors.textSecondary} />
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={16} color={colors.textWhite} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.photoHint}>Tap to change profile photo</Text>
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor={colors.textTertiary}
                            value={info.name}
                            onChangeText={(text) =>
                                setInfo((prev) => ({ ...prev, name: text }))
                            }
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your.email@example.com"
                            placeholderTextColor={colors.textTertiary}
                            value={info.email}
                            onChangeText={(text) =>
                                setInfo((prev) => ({ ...prev, email: text }))
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+1 234 567 8900"
                            placeholderTextColor={colors.textTertiary}
                            value={info.phone}
                            onChangeText={(text) =>
                                setInfo((prev) => ({ ...prev, phone: text }))
                            }
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Physical Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Physical Information</Text>

                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Age</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="25"
                                placeholderTextColor={colors.textTertiary}
                                value={info.age}
                                onChangeText={(text) =>
                                    setInfo((prev) => ({ ...prev, age: text }))
                                }
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="175"
                                placeholderTextColor={colors.textTertiary}
                                value={info.height}
                                onChangeText={(text) =>
                                    setInfo((prev) => ({ ...prev, height: text }))
                                }
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <View style={styles.genderContainer}>
                            {GENDERS.map((gender) => (
                                <TouchableOpacity
                                    key={gender}
                                    style={[
                                        styles.genderButton,
                                        info.gender === gender && styles.genderButtonActive,
                                    ]}
                                    onPress={() =>
                                        setInfo((prev) => ({ ...prev, gender }))
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.genderButtonText,
                                            info.gender === gender &&
                                            styles.genderButtonTextActive,
                                        ]}
                                    >
                                        {gender}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={savePersonalInfo}>
                    <Text style={styles.saveButtonText}>Save Information</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
