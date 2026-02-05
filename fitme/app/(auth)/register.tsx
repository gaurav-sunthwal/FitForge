import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

export default function RegisterScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { login } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await api.auth.register({ email, name });
            if (response.success) {
                await login(response.data.id);
                router.replace("/personal-info");
            } else {
                Alert.alert("Error", response.message || "Registration failed");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Join FitMe and start your transformation
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                            <Ionicons name="person-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="John Doe"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={setName}
                                autoComplete="name"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="hello@example.com"
                                placeholderTextColor={colors.textTertiary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textTertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password-new"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textTertiary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.termsContainer}>
                        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                            By signing up, you agree to our{" "}
                            <Text style={{ color: colors.accent, fontWeight: "600" }}>Terms of Service</Text> and{" "}
                            <Text style={{ color: colors.accent, fontWeight: "600" }}>Privacy Policy</Text>
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.registerButton, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        Already have an account?{" "}
                        <Text
                            style={{ color: colors.accent, fontWeight: "bold" }}
                            onPress={() => router.push("/(auth)/login")}
                        >
                            Log In
                        </Text>
                    </Text>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
    },
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    form: {
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 55,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    termsContainer: {
        marginVertical: 10,
        paddingHorizontal: 4,
    },
    termsText: {
        fontSize: 13,
        lineHeight: 20,
    },
    registerButton: {
        height: 55,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    registerButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        alignItems: "center",
    },
    footerText: {
        fontSize: 15,
    },
});
