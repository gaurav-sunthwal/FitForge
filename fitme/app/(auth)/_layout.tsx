import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const { colors } = useTheme();

    // Show loading while checking auth state
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    // If user is authenticated, redirect to home
    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    // Otherwise show auth screens
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
    );
}
