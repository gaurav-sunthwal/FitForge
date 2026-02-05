import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    hasSeenOnboarding: boolean;
    isLoading: boolean;
    userId: string | null;
    login: (userId: string) => Promise<void>;
    logout: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        loadAuthState();
    }, []);

    const loadAuthState = async () => {
        try {
            const [authStatus, onboardingStatus, savedUserId] = await Promise.all([
                AsyncStorage.getItem("isAuthenticated"),
                AsyncStorage.getItem("hasSeenOnboarding"),
                AsyncStorage.getItem("userId"),
            ]);

            setIsAuthenticated(authStatus === "true");
            setHasSeenOnboarding(onboardingStatus === "true");
            setUserId(savedUserId);
        } catch (error) {
            console.error("Error loading auth state:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (id: string) => {
        try {
            await Promise.all([
                AsyncStorage.setItem("isAuthenticated", "true"),
                AsyncStorage.setItem("userId", id),
            ]);
            setUserId(id);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(["isAuthenticated", "userId"]);
            setUserId(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem("hasSeenOnboarding", "true");
            setHasSeenOnboarding(true);
        } catch (error) {
            console.error("Error completing onboarding:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                hasSeenOnboarding,
                isLoading,
                userId,
                login,
                logout,
                completeOnboarding,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
