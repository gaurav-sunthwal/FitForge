"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function InvitePage() {
    const params = useParams();
    const code = params.code as string;
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {
        const trackClick = async () => {
            try {
                const res = await fetch('/api/v1/invitations/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inviteCode: code, action: 'clicked' })
                });
                if (res.ok) setStatus('ready');
                else setStatus('error');
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };

        if (code) trackClick();
    }, [code]);

    const handleDownload = async () => {
        try {
            await fetch('/api/v1/invitations/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteCode: code, action: 'downloaded' })
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8">
                <div className="space-y-4">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                        <Image
                            src="/logo.png"
                            alt="FitMe Logo"
                            width={100}
                            height={100}
                            className="relative rounded-2xl border border-white/10"
                        />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        You're Invited to <span className="text-orange-500">FitMe</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Join your friend on the ultimate fitness journey. Track workouts, calories, and crush your goals together.
                    </p>
                </div>

                <div className="p-1 rounded-2xl bg-linear-to-r from-orange-500 to-red-600">
                    <div className="bg-[#121212] rounded-xl p-8 space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-orange-500 uppercase tracking-wider">Step 1</p>
                            <h2 className="text-xl font-bold">Download the App</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="https://apps.apple.com/app/your-app-id"
                                    onClick={handleDownload}
                                    className="flex items-center justify-center gap-2 bg-[#1A1A1A] border border-white/5 text-white py-3 rounded-xl font-bold text-sm hover:bg-[#252525] transition-colors"
                                >
                                    App Store
                                </Link>

                                <Link
                                    href="https://play.google.com/store/apps/details?id=your.package.name"
                                    onClick={handleDownload}
                                    className="flex items-center justify-center gap-2 bg-[#1A1A1A] border border-white/5 text-white py-3 rounded-xl font-bold text-sm hover:bg-[#252525] transition-colors"
                                >
                                    Play Store
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 text-gray-500 text-sm">
                    <p>Referral Code: {code}</p>
                    <p className="mt-2">By downloading, you agree to our Terms of Service.</p>
                </div>
            </div>
        </div>
    );
}
