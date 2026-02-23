"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const DownloadSection = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/v1/early-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to join');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section id="download" className="py-24 bg-white overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="bg-black rounded-[3rem] p-12 md:p-24 relative overflow-hidden group">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="lg:w-1/2 space-y-8">
                            <span className="inline-block px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase bg-white/10 text-white/60 rounded-full border border-white/5 backdrop-blur-sm">
                                Early Access
                            </span>
                            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                                Join The<br />
                                <span className="text-white/20 italic">Inner Circle</span> Today.
                            </h2>
                            <p className="text-white/40 max-w-sm text-lg font-medium leading-relaxed">
                                FitMe is currently in invitation-only mode. Register below to secure your spot and receive a download link when we launch.
                            </p>

                            <div className="pt-4 max-w-md">
                                <form onSubmit={handleSubmit} className="relative group/form">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'success'}
                                        className="absolute right-2 top-2 bottom-2 px-8 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 group/btn disabled:bg-zinc-800 disabled:text-zinc-500"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : status === 'success' ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <>
                                                Join Now
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                                <AnimatePresence>
                                    {status === 'success' && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-green-400 text-xs font-bold mt-4 tracking-widest uppercase"
                                        >
                                            Welcome to the evolution. Check your email.
                                        </motion.p>
                                    )}
                                    {status === 'error' && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-400 text-xs font-bold mt-4 tracking-widest uppercase"
                                        >
                                            {message}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-2xl font-black text-white tracking-tighter">1.2k+</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">On Waitlist</p>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div>
                                    <p className="text-2xl font-black text-white tracking-tighter">Limited</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Early Slots</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative flex justify-center">
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative w-[280px] md:w-[320px] aspect-9/19 scale-110 md:scale-125 translate-y-20 lg:translate-y-32"
                            >
                                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-75"></div>
                                <div className="relative w-full h-full bg-zinc-900 rounded-[3rem] p-3 border-8 border-zinc-800 shadow-2xl overflow-hidden">
                                    <Image
                                        src="/images/home.png"
                                        alt="App Preview"
                                        fill
                                        className="object-cover rounded-[2.2rem]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DownloadSection;
