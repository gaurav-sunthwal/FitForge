import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown
} from "react-native-reanimated";
import { useTheme } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { completeOnboarding } = useAuth();

    const handleGetStarted = async () => {
        await completeOnboarding();
        router.push("/(auth)/login");
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/auth-bg.jpg")}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Animated.View
                            entering={FadeInDown.delay(200).duration(1000)}
                            style={styles.header}
                        >
                            <Text style={[styles.title, { color: colors.textWhite }]}>
                                Fit<Text style={{ color: colors.accent }}>Me</Text>
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.textWhite }]}>
                                Your Personal Fitness Companion to Achieve Your Goals
                            </Text>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInDown.delay(400).duration(1000)}
                            style={styles.footer}
                        >
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.accent }]}
                                onPress={handleGetStarted}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginLink}
                                onPress={async () => {
                                    await completeOnboarding();
                                    router.push("/(auth)/login");
                                }}
                            >
                                <Text style={[styles.loginText, { color: colors.textWhite }]}>
                                    Already have an account?{" "}
                                    <Text style={{ color: colors.accent, fontWeight: "bold" }}>
                                        Log In
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        width: width,
        height: height,
    },
    gradient: {
        flex: 1,
        justifyContent: "flex-end",
    },
    content: {
        paddingHorizontal: 30,
        paddingBottom: 60,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 50,
        fontWeight: "900",
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        opacity: 0.9,
        marginTop: 10,
        lineHeight: 28,
    },
    footer: {
        width: "100%",
    },
    button: {
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginLink: {
        marginTop: 25,
        alignItems: "center",
    },
    loginText: {
        fontSize: 15,
    },
});
