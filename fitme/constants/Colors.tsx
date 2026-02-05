import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeColors {
    background: string;
    cardBackground: string;
    iconBackground: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textLight: string;
    textWhite: string;
    accent: string;
    accentLight: string;
    calendarToday: string;
    calendarWorkout: string;
    calendarDefault: string;
    workoutLight: string;
    workoutMedium: string;
    workoutIntense: string;
    quoteAccent: string;
    border: string;
    shadow: string;
}

interface ThemeContextType {
    theme: ThemeMode;
    colors: ThemeColors;
    isDark: boolean;
    setTheme: (theme: ThemeMode) => void;
}

const lightColors: ThemeColors = {
    background: "#FAFAFA",
    cardBackground: "#FFF",
    iconBackground: "#F5F5F5",
    textPrimary: "#000",
    textSecondary: "#666",
    textTertiary: "#999",
    textLight: "#CCC",
    textWhite: "#FFF",
    accent: "#FF6B35",
    accentLight: "#FFE66D",
    calendarToday: "#FFE66D",
    calendarWorkout: "#000",
    calendarDefault: "#F5F5F5",
    workoutLight: "#E8A89A",
    workoutMedium: "#D97A5E",
    workoutIntense: "#C85A3E",
    quoteAccent: "#FFD700",
    border: "#F0F0F0",
    shadow: "#000",
};

const darkColors: ThemeColors = {
    background: "#0A0A0A",
    cardBackground: "#1A1A1A",
    iconBackground: "#2A2A2A",
    textPrimary: "#FFFFFF",
    textSecondary: "#B3B3B3",
    textTertiary: "#808080",
    textLight: "#4D4D4D",
    textWhite: "#FFF",
    accent: "#FF6B35",
    accentLight: "#FFE66D",
    calendarToday: "#FFE66D",
    calendarWorkout: "#FF6B35",
    calendarDefault: "#2A2A2A",
    workoutLight: "#E8A89A",
    workoutMedium: "#D97A5E",
    workoutIntense: "#C85A3E",
    quoteAccent: "#FFD700",
    border: "#2A2A2A",
    shadow: "#000",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("system");
    const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
        Appearance.getColorScheme()
    );

    useEffect(() => {
        loadTheme();
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemColorScheme(colorScheme);
        });
        return () => subscription.remove();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem("themeMode");
            if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
                setThemeState(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error("Error loading theme:", error);
        }
    };

    const setTheme = async (newTheme: ThemeMode) => {
        try {
            await AsyncStorage.setItem("themeMode", newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    };


    const getEffectiveColorScheme = (): "light" | "dark" => {
        if (theme === "system") {
            return systemColorScheme === "dark" ? "dark" : "light";
        }
        return theme;
    };

    const effectiveScheme = getEffectiveColorScheme();
    const colors = effectiveScheme === "dark" ? darkColors : lightColors;
    const isDark = effectiveScheme === "dark";


    return (
        <ThemeContext.Provider value={{ theme, colors, isDark, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

export const Colors = lightColors;
