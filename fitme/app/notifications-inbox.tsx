import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Linking,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../constants/Colors";
import { BASE_URL } from "../utils/api";

interface Notification {
    id: string;
    notificationId: string;
    title: string;
    body: string;
    imageUrl: string | null;
    actionUrl: string | null;
    sentAt: string;
    read: number;
    readAt: string | null;
    createdAt: string;
}

export default function NotificationsInboxScreen() {
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "ios" ? 60 : 40,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.cardBackground,
        },
        backButton: {
            marginRight: 16,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: "800",
            color: colors.textPrimary,
            flex: 1,
        },
        badgeContainer: {
            backgroundColor: colors.accent,
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 4,
            minWidth: 24,
            alignItems: 'center',
        },
        badgeText: {
            color: colors.textWhite,
            fontSize: 12,
            fontWeight: '700',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
        },
        emptyIcon: {
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: "center",
            lineHeight: 20,
        },
        listContent: {
            padding: 16,
        },
        notificationCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            borderLeftWidth: 4,
        },
        unreadCard: {
            borderLeftColor: colors.accent,
            backgroundColor: colors.iconBackground,
        },
        readCard: {
            borderLeftColor: colors.border,
        },
        notificationHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        notificationTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: colors.textPrimary,
            flex: 1,
            marginRight: 8,
        },
        unreadIndicator: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.accent,
        },
        notificationBody: {
            fontSize: 15,
            color: colors.textSecondary,
            lineHeight: 22,
            marginBottom: 8,
        },
        notificationImage: {
            width: '100%',
            height: 160,
            borderRadius: 12,
            marginVertical: 12,
        },
        notificationFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
        },
        notificationTime: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: colors.accent,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
        },
        actionButtonText: {
            color: colors.textWhite,
            fontSize: 13,
            fontWeight: '600',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        refreshButton: {
            backgroundColor: colors.accent,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            marginRight: 8,
        },
        refreshButtonText: {
            color: colors.textWhite,
            fontSize: 14,
            fontWeight: '600',
        },
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');

            if (!userToken) {
                Alert.alert('Error', 'Please log in to view notifications');
                return;
            }

            const response = await fetch(`${BASE_URL}/user/notifications`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');

            if (!userToken) return;

            await fetch(`${BASE_URL}/user/notifications`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ notificationId }),
            });

            // Update local state
            setNotifications(notifications.map(n =>
                n.notificationId === notificationId
                    ? { ...n, read: 1, readAt: new Date().toISOString() }
                    : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleNotificationPress = (notification: Notification) => {
        // Mark as read
        if (notification.read === 0) {
            markAsRead(notification.notificationId);
        }

        // Handle action URL
        if (notification.actionUrl) {
            if (notification.actionUrl.startsWith('fitforge://')) {
                // Handle deep link (you can expand this based on your routing)
                const path = notification.actionUrl.replace('fitforge://', '');
                Alert.alert(
                    'Navigate',
                    `This would navigate to: ${path}`,
                    [{ text: 'OK' }]
                );
            } else if (notification.actionUrl.startsWith('http')) {
                Linking.openURL(notification.actionUrl);
            }
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => n.read === 0).length;

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={onRefresh}
                >
                    <Ionicons name="refresh" size={18} color={colors.textWhite} />
                </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="notifications-off-outline"
                        size={80}
                        color={colors.textSecondary}
                        style={styles.emptyIcon}
                    />
                    <Text style={styles.emptyTitle}>No Notifications</Text>
                    <Text style={styles.emptyText}>
                        You haven't received any notifications yet. Check back later!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.accent}
                        />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.notificationCard,
                                item.read === 0 ? styles.unreadCard : styles.readCard,
                            ]}
                            onPress={() => handleNotificationPress(item)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.notificationHeader}>
                                <Text style={styles.notificationTitle}>{item.title}</Text>
                                {item.read === 0 && <View style={styles.unreadIndicator} />}
                            </View>

                            <Text style={styles.notificationBody}>{item.body}</Text>

                            {item.imageUrl && (
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.notificationImage}
                                    resizeMode="cover"
                                />
                            )}

                            <View style={styles.notificationFooter}>
                                <Text style={styles.notificationTime}>
                                    {formatDate(item.sentAt)}
                                </Text>
                                {item.actionUrl && (
                                    <View style={styles.actionButton}>
                                        <Ionicons name="open-outline" size={14} color={colors.textWhite} />
                                        <Text style={styles.actionButtonText}>Open</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
