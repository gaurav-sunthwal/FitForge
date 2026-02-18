"use client"
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AICoachFeature = () => {
    return (
        <section className="py-24 bg-zinc-50 overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-blue-600 text-white rounded-md shadow-lg shadow-blue-500/20">
                                AI Freedom
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                                Bring Your Own<br />
                                <span className="text-blue-600 italic">Gemini Experts.</span>
                            </h2>
                            <p className="text-foreground/60 max-w-lg text-lg font-medium leading-relaxed">
                                No hidden subscriptions. Simply plug in your own <span className="text-foreground font-bold underline decoration-blue-500/30">Gemini API Key</span> and enjoy high-end AI fitness consultation completely for free.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 relative overflow-hidden group">
                                <h4 className="font-black text-lg mb-2 italic">Zero Cost</h4>
                                <p className="text-foreground/40 text-sm font-medium">Use your free Gemini tier to power your fitness journey without monthly fees.</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 relative overflow-hidden group">
                                <h4 className="font-black text-lg mb-2 italic">Total Privacy</h4>
                                <p className="text-foreground/40 text-sm font-medium">Your API key is stored locally on your device. We never see your private data.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 flex justify-center lg:justify-end"
                    >
                        <div className="relative w-[280px] h-[580px] md:w-[320px] md:h-[660px] bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-zinc-900 group">
                            <div className="w-full h-full bg-zinc-900 rounded-[2.8rem] overflow-hidden relative">
                                <Image
                                    src="/images/ai-test-page.png"
                                    alt="AI Consultation"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Message Bubbles Overlay */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -left-16 top-1/4 glass p-4 rounded-2xl shadow-xl max-w-[200px] border border-white/20 hidden md:block"
                            >
                                <p className="text-xs font-bold text-foreground/80 leading-relaxed italic">
                                    "Yes, 30g of fast-acting carbs will boost your performance."
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>
        </section>
    );
};

export default AICoachFeature;
