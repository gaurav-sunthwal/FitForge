"use client"
import React from 'react';
import { motion } from 'framer-motion';

const CaloriesFeature = () => {
    return (
        <section className="py-24 bg-black overflow-hidden relative">
            {/* Background Grain/Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 space-y-8 z-10"
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-black tracking-[0.2em] uppercase bg-white/10 text-white/60 rounded-full border border-white/10 backdrop-blur-sm">
                            AI Vision
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                            Eat Smart.<br />
                            <span className="text-white/20 italic">Track Faster.</span>
                        </h2>
                        <p className="text-white/40 max-w-lg text-lg font-medium leading-relaxed">
                            Our proprietary AI Vision technology analyzes your plate in milliseconds. Just point, shoot, and get instant nutritional data.
                        </p>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <span className="text-xl">⚡</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Instant Analysis</h4>
                                    <p className="text-white/30 text-sm">Gemini-powered food identification.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Macro Precision</h4>
                                    <p className="text-white/30 text-sm">Accurate protein, fats, and carbs breakdown.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-1/2 relative perspective-1000"
                    >
                        {/* Massive Video Mockup */}
                        <div className="relative w-[280px] h-[580px] md:w-[320px] md:h-[660px] bg-[#0A0A0A] rounded-[3.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] mx-auto border-12 border-zinc-900 overflow-hidden">
                            <div className="w-full h-full bg-black rounded-[2.8rem] overflow-hidden relative">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-80"
                                >
                                    <source src="/images/calores.mp4" type="video/mp4" />
                                </video>
                            </div>

                            {/* Improved Calorie Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="absolute right-[-20%] top-[40%] z-20"
                            >
                                <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-4xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] w-[200px]">
                                    <p className="text-white/30 text-[9px] uppercase font-black tracking-[0.2em] mb-3">Detected</p>
                                    <div className="flex items-end gap-1 mb-4">
                                        <span className="text-white text-4xl font-black leading-none italic">420</span>
                                        <span className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest leading-none">kcal</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Protein", value: "25g", color: "bg-blue-500" },
                                            { label: "Carbs", value: "45g", color: "bg-green-500" }
                                        ].map((macro, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1 h-1 rounded-full ${macro.color}`} />
                                                    <span className="text-white/40 text-[10px] uppercase font-black">{macro.label}</span>
                                                </div>
                                                <span className="text-white text-[10px] font-bold">{macro.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Backdrop Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CaloriesFeature;
