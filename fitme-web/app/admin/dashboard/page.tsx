'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    title: string;
    body: string;
    imageUrl: string | null;
    actionUrl: string | null;
    sentAt: string;
    recipientCount: number;
}

export default function AdminDashboard() {
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingNotifications, setFetchingNotifications] = useState(true);

    // Form fields
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [actionUrl, setActionUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const name = localStorage.getItem('adminName');
        const email = localStorage.getItem('adminEmail');

        if (!token) {
            router.push('/admin/login');
            return;
        }

        setAdminName(name || 'Admin');
        setAdminEmail(email || '');

        fetchNotifications(token);
    }, [router]);

    const fetchNotifications = async (token: string) => {
        try {
            const response = await fetch('/api/v1/admin/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    router.push('/admin/login');
                    return;
                }
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data.notifications.reverse()); // Show latest first
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setFetchingNotifications(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/admin/login');
    };

    const handleCreateNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch('/api/v1/admin/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    body,
                    imageUrl: imageUrl || null,
                    actionUrl: actionUrl || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to send notification');
                setLoading(false);
                return;
            }

            setSuccess(`Notification sent successfully to ${data.recipientCount} users!`);
            setTitle('');
            setBody('');
            setImageUrl('');
            setActionUrl('');
            setShowCreateForm(false);

            // Refresh notifications list
            fetchNotifications(token);

            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            console.error('Error creating notification:', error);
            setError('An error occurred while sending notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">FitForge Admin</h1>
                            <p className="text-purple-200 text-sm mt-1">Notification Management</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-white font-semibold">{adminName}</p>
                                <p className="text-purple-300 text-sm">{adminEmail}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition border border-red-500/30"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-100 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Create Notification Button */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
                    >
                        {showCreateForm ? '✕ Cancel' : '+ Create New Notification'}
                    </button>
                </div>

                {/* Create Notification Form */}
                {showCreateForm && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Send Notification to All Users</h2>

                        <form onSubmit={handleCreateNotification} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-purple-100 mb-2">
                                    Notification Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="e.g., New Workout Challenge Available!"
                                    required
                                    maxLength={100}
                                />
                                <p className="mt-1 text-xs text-purple-200">{title.length}/100 characters</p>
                            </div>

                            <div>
                                <label htmlFor="body" className="block text-sm font-medium text-purple-100 mb-2">
                                    Notification Message *
                                </label>
                                <textarea
                                    id="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="e.g., Join our 30-day fitness challenge and win amazing prizes!"
                                    required
                                    rows={4}
                                    maxLength={500}
                                />
                                <p className="mt-1 text-xs text-purple-200">{body.length}/500 characters</p>
                            </div>

                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-purple-100 mb-2">
                                    Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <p className="mt-1 text-xs text-purple-200">Add an image to make your notification more engaging</p>
                            </div>

                            <div>
                                <label htmlFor="actionUrl" className="block text-sm font-medium text-purple-100 mb-2">
                                    Action URL / Deep Link (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="actionUrl"
                                    value={actionUrl}
                                    onChange={(e) => setActionUrl(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="e.g., fitforge://workout/challenge"
                                />
                                <p className="mt-1 text-xs text-purple-200">Deep link or URL to open when notification is tapped</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Notification...
                                    </span>
                                ) : (
                                    '📤 Send to All Users'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Notifications History */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Notification History</h2>

                    {fetchingNotifications ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            <p className="text-purple-200 mt-4">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-purple-200 text-lg">No notifications sent yet</p>
                            <p className="text-purple-300 text-sm mt-2">Create your first notification above</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {notification.title}
                                            </h3>
                                            <p className="text-purple-200 text-sm mb-3">
                                                {notification.body}
                                            </p>
                                            {notification.imageUrl && (
                                                <p className="text-xs text-purple-300 mb-2">
                                                    🖼️ Image: {notification.imageUrl}
                                                </p>
                                            )}
                                            {notification.actionUrl && (
                                                <p className="text-xs text-purple-300 mb-2">
                                                    🔗 Action: {notification.actionUrl}
                                                </p>
                                            )}
                                            <div className="flex items-center space-x-4 text-xs text-purple-300">
                                                <span>👥 {notification.recipientCount} recipients</span>
                                                <span>📅 {new Date(notification.sentAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-200 border border-green-500/30">
                                                ✓ Sent
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
