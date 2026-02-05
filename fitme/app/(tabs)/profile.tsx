import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ApiKeyModal from "../../components/profile/ApiKeyModal";
import { ThemeMode, useTheme } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "light", label: "Light", icon: "sunny" },
    { id: "dark", label: "Dark", icon: "moon" },
    { id: "system", label: "System", icon: "phone-portrait" },
];

export default function ProfileScreen() {
    const { colors, theme, setTheme } = useTheme();
    const { logout } = useAuth();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userName, setUserName] = useState("Gaurav Sunthwal");
    const [userEmail, setUserEmail] = useState("gaurav@example.com");
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [geminiApiKey, setGeminiApiKey] = useState("");

    useEffect(() => {
        loadUserData();
        loadApiKey();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const loadUserData = async () => {
        try {
            // Try backend first
            const response = await api.user.getProfile();
            if (response.success && response.data) {
                const info = response.data;
                setUserName(info.name || "Gaurav Sunthwal");
                setUserEmail(info.email || "gaurav@example.com");
                if (info.imageUrl) {
                    setProfileImage(info.imageUrl);
                }
                const localInfo = {
                    name: info.name,
                    email: info.email,
                    profileImage: info.imageUrl,
                    age: info.profile?.age,
                    height: info.profile?.height,
                    gender: info.profile?.gender,
                };
                await AsyncStorage.setItem("personalInfo", JSON.stringify(localInfo));
                return;
            }

            // Fallback
            const savedInfo = await AsyncStorage.getItem("personalInfo");
            if (savedInfo) {
                const info = JSON.parse(savedInfo);
                if (info.name) setUserName(info.name);
                if (info.email) setUserEmail(info.email);
                if (info.profileImage) setProfileImage(info.profileImage);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    const loadApiKey = async () => {
        try {
            const savedKey = await AsyncStorage.getItem("geminiApiKey");
            if (savedKey) setGeminiApiKey(savedKey);
        } catch (error) {
            console.error("Error loading API key:", error);
        }
    };

    const handleSetTheme = async (mode: ThemeMode) => {
        setTheme(mode);
        try {
            await api.user.updateSettings({ themeMode: mode });
        } catch (error) {
            console.error("Error updating theme on backend:", error);
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
            const newImageUri = result.assets[0].uri;
            setProfileImage(newImageUri);

            try {
                // Update on backend
                await api.user.updateProfile({ profileImage: newImageUri });

                const savedInfo = await AsyncStorage.getItem("personalInfo");
                const info = savedInfo ? JSON.parse(savedInfo) : {};
                info.profileImage = newImageUri;
                await AsyncStorage.setItem("personalInfo", JSON.stringify(info));

                Alert.alert("Success", "Profile image updated!");
            } catch (error) {
                console.error("Error saving profile image:", error);
                Alert.alert("Error", "Failed to update profile image on server");
            }
        }
    };

    const openHelpSupport = async () => {
        const supportUrl = "https://github.com/yourusername/fitme/issues";
        try {
            const canOpen = await Linking.canOpenURL(supportUrl);
            if (canOpen) {
                await WebBrowser.openBrowserAsync(supportUrl);
            } else {
                Alert.alert("Help & Support", "Email us at: support@fitme.com");
            }
        } catch (error) {
            Alert.alert("Help & Support", "Email us at: support@fitme.com");
        }
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    };

    const menuItems = [
        {
            id: "personal",
            title: "Personal Information",
            icon: "person-outline" as const,
            onPress: () => router.push("/personal-info"),
        },
        {
            id: "goals",
            title: "Fitness Goals",
            icon: "trophy-outline" as const,
            onPress: () => router.push("/fitness-goals"),
        },
        {
            id: "notifications",
            title: "Notifications",
            icon: "notifications-outline" as const,
            onPress: () => Alert.alert("Coming Soon", "Notification settings"),
        },
        {
            id: "privacy",
            title: "Privacy & Security",
            icon: "lock-closed-outline" as const,
            onPress: () => Alert.alert("Coming Soon", "Privacy settings"),
        },
        {
            id: "help",
            title: "Help & Support",
            icon: "help-circle-outline" as const,
            onPress: openHelpSupport,
        },
        {
            id: "logout",
            title: "Logout",
            icon: "log-out-outline" as const,
            onPress: handleLogout,
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <TouchableOpacity style={styles.profileImageContainer} onPress={pickProfileImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.iconBackground }]}>
                                <Ionicons name="person" size={48} color={colors.textSecondary} />
                            </View>
                        )}
                        <View style={[styles.editBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                            <Ionicons name="camera" size={16} color={colors.textWhite} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.userName, { color: colors.textPrimary }]}>{userName}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>
                </View>

                {/* Theme Selection */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
                    <View style={styles.themeContainer}>
                        {THEME_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.themeButton,
                                    {
                                        backgroundColor: theme === option.id ? colors.accent : colors.cardBackground,
                                        borderColor: theme === option.id ? colors.accent : colors.border,
                                    },
                                ]}
                                onPress={() => handleSetTheme(option.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={option.icon}
                                    size={24}
                                    color={theme === option.id ? colors.textWhite : colors.textPrimary}
                                />
                                <Text
                                    style={[
                                        styles.themeButtonText,
                                        { color: theme === option.id ? colors.textWhite : colors.textPrimary },
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* AI Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>AI Features</Text>
                    <TouchableOpacity
                        style={[styles.aiCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                        onPress={() => setShowApiKeyModal(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.aiCardLeft}>
                            <View style={[styles.aiIconContainer, { backgroundColor: colors.iconBackground }]}>
                                <Ionicons name="sparkles" size={24} color={colors.accent} />
                            </View>
                            <View style={styles.aiTextContainer}>
                                <Text style={[styles.aiCardTitle, { color: colors.textPrimary }]}>
                                    Gemini API Key
                                </Text>
                                <Text style={[styles.aiCardSubtitle, { color: colors.textSecondary }]}>
                                    {geminiApiKey ? "Configured ✓" : "Not configured"}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Settings</Text>
                    <View style={[styles.menuContainer, { backgroundColor: colors.cardBackground }]}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    { borderBottomColor: colors.border },
                                    index === menuItems.length - 1 && styles.lastMenuItem,
                                ]}
                                onPress={item.onPress}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: colors.iconBackground }]}>
                                        <Ionicons name={item.icon} size={22} color={colors.textPrimary} />
                                    </View>
                                    <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>
                                        {item.title}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Text style={[styles.versionText, { color: colors.textTertiary }]}>Version 1.0.0</Text>
            </ScrollView>

            <ApiKeyModal
                visible={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                currentApiKey={geminiApiKey}
                onSave={setGeminiApiKey}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingBottom: 30 },
    profileHeader: { alignItems: "center", paddingHorizontal: 20, marginBottom: 32 },
    profileImageContainer: { position: "relative", marginBottom: 16 },
    profileImage: { width: 100, height: 100, borderRadius: 50 },
    profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: "center", alignItems: "center" },
    editBadge: { position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 3 },
    userName: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
    userEmail: { fontSize: 14, fontWeight: "500" },
    section: { marginHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
    themeContainer: { flexDirection: "row", gap: 12 },
    themeButton: { flex: 1, borderRadius: 12, padding: 16, alignItems: "center", borderWidth: 2, gap: 8 },
    themeButtonText: { fontSize: 12, fontWeight: "600" },
    aiCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 16, borderWidth: 1 },
    aiCardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    aiIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 12 },
    aiTextContainer: { flex: 1 },
    aiCardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
    aiCardSubtitle: { fontSize: 14 },
    menuContainer: { borderRadius: 16, overflow: "hidden" },
    menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1 },
    lastMenuItem: { borderBottomWidth: 0 },
    menuItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    menuIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 12 },
    menuItemText: { fontSize: 16, fontWeight: "500" },
    versionText: { fontSize: 12, textAlign: "center", marginTop: 24 },
});
