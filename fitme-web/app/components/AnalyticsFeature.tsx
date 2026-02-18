"use client"
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AnalyticsFeature = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative w-full max-w-[600px] h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-foreground/5">
                            <Image
                                src="/images/perfomance.png"
                                alt="Analytics Performance"
                                fill
                                className="object-cover object-top hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        {/* Detail Highlight Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-10 -right-6 md:right-10 bg-black p-8 rounded-[2.5rem] shadow-2xl text-white max-w-[280px]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <span className="text-xl font-bold">↑</span>
                                </div>
                                <p className="text-sm font-bold">12% Growth</p>
                            </div>
                            <p className="text-white/50 text-xs font-medium leading-relaxed">
                                Your workout volume has increased significantly this week. Keep hitting those PRs!
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 space-y-10"
                    >
                        <span className="inline-block px-5 py-2 text-[10px] font-black tracking-widest uppercase bg-foreground/5 text-foreground/40 rounded-xl border border-foreground/5">
                            Power of Data
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                            Deep<br />
                            <span className="text-foreground/20">Analytics.</span>
                        </h2>
                        <p className="text-foreground/50 max-w-lg text-lg font-medium leading-relaxed">
                            Visualize your progress with surgical precision. From volume tracking to consistency scores, we turn your hard work into actionable insights.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Volume Tracking", desc: "Monitor total weight lifted over time." },
                                { title: "Consistency Score", desc: "AI-calculated score based on your habits." },
                                { title: "Goal Projection", desc: "Scientific estimates of when you'll hit your targets." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="text-foreground/10 text-4xl font-black transition-colors group-hover:text-foreground">0{i + 1}</div>
                                    <div>
                                        <h4 className="font-black text-xl text-foreground italic">{item.title}</h4>
                                        <p className="text-foreground/40 text-sm font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsFeature;
