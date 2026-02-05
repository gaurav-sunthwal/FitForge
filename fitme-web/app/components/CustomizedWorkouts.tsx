import React from 'react';
import Image from 'next/image';

const CustomizedWorkouts = () => {
    return (
        <section className="py-20 bg-foreground/5 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-background border border-foreground/10 text-foreground/60 rounded-full">
                            Your Goals
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Track What You Eat, Stay on Point
                        </h2>
                        <p className="text-foreground/60 max-w-md leading-relaxed text-lg">
                            FitMe helps you log your meals effortlessly and keep track of calories, protein, and daily nutrition. Add food manually or snap a photo for quick AI analysis—simple, fast, and accurate.
                        </p>
                        <button className="bg-foreground text-background px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-foreground/10">
                            Download App
                        </button>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative w-[300px] md:w-[350px] aspect-[9/18.5] bg-black rounded-[3rem] p-3 shadow-2xl mx-auto">
                            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative border-4 border-black">
                                <Image
                                    src="/images/app-ss-3.png"
                                    alt="Custom Workout Plan"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Floating Nutrition Elements */}
                        {/* Water Tracker */}
                        <div className="absolute -left-12 top-10 w-48 bg-background p-4 rounded-3xl shadow-xl border border-foreground/5 hidden md:block animate-bounce-slow">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">Hydration</p>
                                <span className="text-blue-500 text-xs">💧 4/8</span>
                            </div>
                            <div className="flex gap-1.5 mb-2">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-1.5 flex-1 bg-blue-500 rounded-full" />)}
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-1.5 flex-1 bg-foreground/10 rounded-full" />)}
                            </div>
                            <p className="text-[9px] text-foreground/40">4 more glasses to go</p>
                        </div>

                        {/* AI Food Analysis */}
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-52 bg-background p-5 rounded-3xl shadow-xl border border-foreground/5 hidden md:block">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-600">
                                    <span className="text-sm">📸</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">AI Analysis</p>
                                    <p className="text-[9px] text-foreground/40">Snap your meal</p>
                                </div>
                            </div>
                            <div className="bg-foreground/5 rounded-xl p-3 border border-foreground/5">
                                <p className="text-[10px] text-foreground/60 leading-relaxed font-medium">
                                    <span className="text-orange-600">Gemini:</span> "Oatmeal with Berries - 320 cal, 12g Protein detected."
                                </p>
                            </div>
                        </div>

                        {/* Floating Review Card */}
                        <div className="absolute -right-4 bottom-10 w-56 bg-background p-6 rounded-3xl shadow-2xl border border-foreground/10 hidden md:block">
                            <div className="text-3xl mb-3">😤</div>
                            <p className="text-sm font-medium leading-relaxed text-foreground">
                                Transform Dreams Into Reality
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomizedWorkouts;
