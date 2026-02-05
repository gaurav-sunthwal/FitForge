"use client"
import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const floatingVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-background">
            <motion.div
                className="container mx-auto px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.span
                    variants={itemVariants}
                    className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase bg-foreground/5 text-foreground/60 rounded-full"
                >
                    Fitness App
                </motion.span>
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground"
                >
                    The Fitness <span className="text-foreground/40">Journey</span><br />Starts Here
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-foreground/60 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed"
                >
                    Master your wellness with FitMe. From AI-powered nutrition tracking to personalized workout consistency, we provide the tools you need to build the body and discipline you've always wanted.
                </motion.p>
                <motion.div variants={itemVariants} className="flex justify-center mb-12">
                    <button className="bg-foreground text-background px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-foreground/10">
                        Download App
                    </button>
                </motion.div>

                <div className="relative max-w-5xl mx-auto mt-12 h-[600px]">
                    {/* Main Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                        className="absolute left-1/2 top-0 -translate-x-1/2 w-[280px] md:w-[320px] aspect-[9/18.5] bg-black rounded-[3rem] p-3 shadow-2xl z-10"
                    >
                        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                            <Image
                                src="/images/app-ss-4.png"
                                alt="App Dashboard"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Floating Elements - Desktop */}
                    {/* Left Side */}
                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute left-0 top-1/4 w-56 bg-background p-5 rounded-3xl shadow-xl border border-foreground/5 animate-bounce-slow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600">
                                <span className="text-xl">📅</span>
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-black text-foreground leading-none">7</p>
                                <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-bold">Day Streak</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute left-10 top-[60%] w-48 bg-background p-5 rounded-3xl shadow-xl border border-foreground/5"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600">
                                <span className="text-xl">🏆</span>
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-black text-foreground leading-none">12</p>
                                <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-bold">This Month</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute right-0 top-1/3 w-56 bg-background p-5 rounded-3xl shadow-xl border border-foreground/5"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/10 rounded-2xl text-green-600">
                                <span className="text-xl">📈</span>
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-black text-foreground leading-none">85%</p>
                                <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-bold">Consistency</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute right-10 top-2/3 w-64 bg-background p-6 rounded-[2.5rem] shadow-2xl border border-foreground/5"
                    >
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs ring-4 ring-yellow-400/20">1</div>
                                <p className="text-sm font-bold text-foreground">Sunday consistency</p>
                            </div>
                            <p className="text-xs text-foreground/50 leading-relaxed italic">
                                "Success starts with self-discipline."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
