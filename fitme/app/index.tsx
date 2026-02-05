import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

export default function Index() {
    const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuth();
    const { colors } = useTheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!hasSeenOnboarding) {
        return <Redirect href="/(auth)/welcome" />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)" />;
}
