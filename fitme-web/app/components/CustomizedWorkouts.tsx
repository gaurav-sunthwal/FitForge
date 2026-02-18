"use client"
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CustomizedWorkouts = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-zinc-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 space-y-10"
                    >
                        <span className="inline-block px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-white border border-foreground/5 text-foreground shadow-sm rounded-md">
                            Smart Scheduling
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                            Your Time,<br /><span className="text-foreground/20 italic">Your Terms.</span>
                        </h2>
                        <p className="text-foreground/50 max-w-lg leading-relaxed text-lg font-medium">
                            Set custom reminder windows that fit your biological clock. Whether you're a 5 AM warrior or a midnight crusher, FitMe ensures you're nudged at exactly the right moment.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-foreground/5 shadow-sm">
                                <h4 className="font-black text-xl mb-1 italic">Flexible</h4>
                                <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">Custom Alerts</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-foreground/5 shadow-sm">
                                <h4 className="font-black text-xl mb-1 italic">85%</h4>
                                <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">Avg. Consistency Ratio</p>
                            </div>
                        </div>

                        <button
                            onClick={() => scrollToSection('download')}
                            className="bg-foreground text-background px-8 py-4 rounded-xl text-md font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-foreground/10 active:scale-95"
                        >
                            Set Your Schedule
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative flex justify-center"
                    >
                        <div className="relative w-[280px] h-[580px] md:w-[320px] md:h-[660px] bg-zinc-900 rounded-[3rem] p-3 shadow-[0_0_50px_rgba(0,0,0,0.1)] border-8 border-zinc-800 focus-within:z-10">
                            <div className="w-full h-full bg-black rounded-[2.2rem] overflow-hidden relative">
                                <Image
                                    src="/images/notifaction.png"
                                    alt="Notification Schedule"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                        </div>

                        {/* Floating Achievement */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-10 top-20 w-56 bg-white p-6 rounded-4xl shadow-2xl border border-foreground/5 hidden md:block"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-yellow-400 rounded-2xl text-black">
                                    <span className="text-xl font-bold">🔥</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">Ongoing</p>
                                    <p className="text-lg font-black text-foreground leading-none">7 Days</p>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-yellow-400" />
                            </div>
                        </motion.div>

                        {/* Floating Tip */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -right-10 bottom-20 w-64 bg-foreground p-8 rounded-[2.5rem] shadow-2xl hidden md:block"
                        >
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Today's Wisdom</p>
                            <p className="text-white text-lg font-black leading-snug italic">
                                "The only bad workout is the one that didn't happen."
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CustomizedWorkouts;
