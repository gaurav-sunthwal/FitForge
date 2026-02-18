"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DownloadSection = () => {
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
                                Available Now
                            </span>
                            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                                Start Your<br />
                                <span className="text-white/20 italic">Evolution</span> Today.
                            </h2>
                            <p className="text-white/40 max-w-sm text-lg font-medium leading-relaxed">
                                Join over 50k+ athletes redefining their limits. Download FitMe and take control of your performance.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="hover:scale-105 transition-all active:scale-95 group/btn relative w-44 h-14">
                                    <Image
                                        src="/images/appstore.png"
                                        alt="Download on App Store"
                                        fill
                                        className="object-contain"
                                    />
                                </button>
                                <button className="hover:scale-105 transition-all active:scale-95 group/btn relative w-44 h-14">
                                    <Image
                                        src="/images/playstore.png"
                                        alt="Get it on Play Store"
                                        fill
                                        className="object-contain"
                                    />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-2xl font-black text-white tracking-tighter">4.9/5</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">App Store Rating</p>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div>
                                    <p className="text-2xl font-black text-white tracking-tighter">10M+</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Workouts Tracked</p>
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
