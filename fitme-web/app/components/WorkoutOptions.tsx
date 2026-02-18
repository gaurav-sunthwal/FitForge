"use client"
import React from 'react';
import Image from 'next/image';

const WorkoutOptions = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="relative w-full h-[600px] md:h-[800px] rounded-[3rem] overflow-hidden group shadow-2xl">
                    <Image
                        src="/images/workout_bg.png"
                        alt="Workout Training"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                        <div className="max-w-3xl">
                            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest uppercase bg-white/20 backdrop-blur-md text-white rounded-full border border-white/20">
                                Global Library
                            </span>
                            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                                Endless<br />Workout Options
                            </h2>
                            <p className="text-white/60 text-lg max-w-xl mb-12 leading-relaxed">
                                Explore a massive library of exercises categorized for Every muscle group. Whether you're pushing for strength or training for endurance, we have the perfect routine.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                {[
                                    { title: "Upper Workout", count: "Core, chest, and shoulders.", emoji: "🤸‍♀️" },
                                    { title: "Strong Arms", count: "Bicep and tricep precision.", emoji: "💪" },
                                    { title: "Conditioning", count: "Maximum calorie burn.", emoji: "🏃‍♀️" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                        <div className="text-2xl mb-4 group-hover/item:scale-125 transition-transform">{item.emoji}</div>
                                        <h3 className="text-white font-black mb-1 italic text-lg">{item.title}</h3>
                                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{item.count}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollToSection('download')}
                                className="bg-white text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl"
                            >
                                Explore All Plans
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkoutOptions;
