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
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="relative pt-40 pb-20 overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]"></div>

            <motion.div
                className="container mx-auto px-6 text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.span
                    variants={itemVariants}
                    className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.2em] uppercase bg-foreground/5 text-foreground/40 rounded-full border border-foreground/5 backdrop-blur-sm"
                >
                    The Future of Fitness
                </motion.span>
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.9]"
                >
                    Redefine Your <br />
                    <span className="text-foreground/20 italic">Strength</span> Powered by AI
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-foreground/50 max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed font-medium"
                >
                    Experience the ultimate fitness ecosystem. Precision tracking, AI-powered insights, and a community built for performance.
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6 mb-24">
                    <button
                        onClick={() => scrollToSection('download')}
                        className="bg-foreground text-background px-12 py-5 rounded-4xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-foreground/10"
                    >
                        Get Started Free
                    </button>
                    <button
                        onClick={() => scrollToSection('features')}
                        className="bg-foreground/5 text-foreground border border-foreground/10 px-12 py-5 rounded-4xl text-sm font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all active:scale-95"
                    >
                        View System
                    </button>
                </motion.div>

                <div className="relative max-w-5xl mx-auto h-[600px] md:h-[800px]">
                    {/* Main Phone Mockup with Glow */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                        className="absolute left-1/2 top-0 -translate-x-1/2 w-[280px] md:w-[320px] aspect-[9/19.5] bg-black rounded-[3.5rem] p-3 shadow-[0_0_100px_rgba(59,130,246,0.15)] z-10 border-8 border-zinc-900 perspective-1000"
                    >
                        <div className="w-full h-full bg-zinc-950 rounded-[2.8rem] overflow-hidden relative border border-white/5">
                            <Image
                                src="/images/home.png"
                                alt="FitMe Dashboard"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Left Side Floating Cards */}
                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute left-[-10%] top-1/4 w-60 bg-white/80 backdrop-blur-xl p-6 rounded-4xl shadow-2xl border border-foreground/5"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600">
                                <span className="text-xl">🔥</span>
                            </div>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-2xl text-foreground leading-none">7</p>
                                <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">Day Streak</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute left-[-5%] top-2/3 w-52 bg-white/80 backdrop-blur-xl p-6 rounded-4xl shadow-2xl border border-foreground/5"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                                <span className="text-xl">🏆</span>
                            </div>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-2xl text-foreground leading-none">12</p>
                                <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">Milestones</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side Floating Cards */}
                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute right-[-10%] top-1/3 w-64 bg-white/80 backdrop-blur-xl p-6 rounded-4xl shadow-2xl border border-foreground/5"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                                <span className="text-xl">📈</span>
                            </div>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-2xl text-foreground leading-none">85%</p>
                                <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">Consistency</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={floatingVariants}
                        className="hidden lg:block absolute right-[-5%] top-[70%] w-72 bg-zinc-950 p-8 rounded-[2.5rem] shadow-2xl border border-white/5"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    >
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-4 italic">Daily Insight</p>
                        <p className="text-white text-lg font-black leading-tight tracking-tighter italic">
                            "Success starts with self-discipline."
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
