import React from 'react';
import { db } from '@/lib/db';
import { earlyAccessUsers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface DownloadPageProps {
    params: Promise<{ id: string }>;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
    const { id } = await params;

    // Verify the download ID in database
    const [user] = await db.select()
        .from(earlyAccessUsers)
        .where(eq(earlyAccessUsers.id, id))
        .limit(1);

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
                        <AlertTriangle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white tracking-tighter">INVALID LINK</h1>
                        <p className="text-white/40 font-medium">This download link is invalid or has expired.</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Optional: Log the download attempt or update a counter
    // await db.update(earlyAccessUsers).set({ downloadCount: sql`${earlyAccessUsers.downloadCount} + 1` }).where(eq(earlyAccessUsers.id, id));

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
            {/* Header */}
            <nav className="p-8">
                <Link href="/" className="text-2xl font-black italic tracking-tighter">FitMe</Link>
            </nav>

            <main className="container mx-auto px-6 pt-20 pb-40">
                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <span className="inline-block px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase bg-black/5 text-black/40 rounded-full border border-black/5">
                                Verified Access
                            </span>
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                                    YOUR BUILD<br />
                                    <span className="text-black/20 italic">IS READY.</span>
                                </h1>
                                <p className="text-black/50 text-xl font-medium max-w-sm">
                                    Hey {user.name || 'Athlete'}, your personalized early access package is verified and ready for deployment.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href={`/api/v1/download/${id}`}
                                    className="group relative flex items-center justify-between w-full bg-black text-white p-6 rounded-3xl overflow-hidden hover:bg-blue-600 transition-all active:scale-[0.98]"
                                >
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Download className="w-6 h-6" />
                                        </div>
                                        <div className="text-left font-black tracking-tighter">
                                            <p className="text-xl leading-none">Download Build</p>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1 italic">Version 0.1.0 • Android (APK)</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                                </a>

                                <p className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] text-center">
                                    Single-user license verified for: {user.email}
                                </p>
                            </div>

                            <div className="pt-10 grid grid-cols-2 gap-8 border-t border-black/5">
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-black/30">Architecture</p>
                                    <p className="font-bold">v8a, v7a (Universal)</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-black/30">Size</p>
                                    <p className="font-bold">24.8 MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
                            <div className="relative bg-zinc-950 p-12 rounded-[4rem] border border-black/5 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <div className="space-y-4 font-mono text-[10px] text-white/40">
                                        <p className="text-green-500">$ fitme --verify --id={id.slice(0, 8)}...</p>
                                        <p>[SYSTEM] Verifying cryptographic signature...</p>
                                        <p>[SYSTEM] Identity matched: {user.email}</p>
                                        <p>[SYSTEM] Session established</p>
                                        <p>[SYSTEM] Payload ready for transmission</p>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[80%] bg-blue-500 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
