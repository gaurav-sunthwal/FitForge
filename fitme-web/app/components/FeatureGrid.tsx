"use client"
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FeatureGrid = () => {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
                    >
                        Features
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mb-6"
                    >
                        Elevate Every <span className="text-foreground/30">Rep</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-foreground/50 max-w-2xl mx-auto text-xl"
                    >
                        Experience a suite of elite features designed to push your limits and track your evolution.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
                    {/* Calories Tracking - Large/Primary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="md:col-span-8 relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 group"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                        >
                            <source src="/images/calores.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-10 left-10 right-10">
                            <h3 className="text-3xl font-bold text-white mb-2">Precision Calories</h3>
                            <p className="text-white/60 text-lg max-w-md">
                                Real-time calorie and macro tracking with AI-assisted meal scanning.
                            </p>
                        </div>
                    </motion.div>

                    {/* Analytics - Tall */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-4 relative rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-foreground/5 group px-8 pt-10"
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Deep Analytics</h3>
                            <p className="text-foreground/50 text-sm mb-8">
                                Visualize your strength gains and consistency over time.
                            </p>
                        </div>
                        <div className="relative w-full h-full mt-4 rounded-t-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
                            <Image
                                src="/images/perfomance.png"
                                alt="Performance Analytics"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </motion.div>

                    {/* AI Consultation - Half */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-6 relative rounded-[2.5rem] overflow-hidden bg-blue-50 border border-blue-100 group flex items-center justify-between px-10"
                    >
                        <div className="max-w-[50%]">
                            <h3 className="text-2xl font-bold text-blue-950 mb-2">AI Coach</h3>
                            <p className="text-blue-900/40 text-sm">
                                Get instant answers to your fitness and nutrition questions from Gemini.
                            </p>
                        </div>
                        <div className="relative w-[180px] h-[320px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 xl:group-hover:scale-110">
                            <Image
                                src="/images/ai-test-page.png"
                                alt="AI Analysis"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Notifications - Half */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-6 relative rounded-[2.5rem] overflow-hidden bg-orange-50 border border-orange-100 group flex items-center justify-between px-10"
                    >
                        <div className="relative w-[180px] h-[320px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 xl:group-hover:scale-110">
                            <Image
                                src="/images/notifaction.png"
                                alt="Notifications"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="max-w-[50%] text-right">
                            <h3 className="text-2xl font-bold text-orange-950 mb-2">Smart Alerts</h3>
                            <p className="text-orange-900/40 text-sm">
                                Personalized reminders to keep your streak alive and goals in sight.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
