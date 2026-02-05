import React from 'react';
import Image from 'next/image';

const WorkoutOptions = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="relative w-full h-[600px] md:h-[700px] rounded-[3rem] overflow-hidden group">
                    <Image
                        src="/images/workout_bg.png"
                        alt="Workout Training"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                        <div className="max-w-2xl">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white rounded-full">
                                Custom Plans
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Endless<br />Workout Options
                            </h2>
                            <p className="text-white/70 text-lg max-w-lg mb-12">
                                Explore a massive library of exercises categorized for Every muscle group. Whether you're pushing for strength or training for endurance, we have the perfect routine.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Upper Workout", count: "Sculpt and strengthen your core, chest, and shoulders.", emoji: "🤸‍♀️" },
                                    { title: "Strong Arms", count: "High-intensity routines for bicep and tricep definition.", emoji: "💪" },
                                    { title: "Full Body Training", count: "Ultimate conditioning for maximum calorie burn and muscle growth.", emoji: "🏃‍♀️" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition-colors">
                                        <div className="text-2xl mb-4">{item.emoji}</div>
                                        <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                        <p className="text-white/50 text-xs leading-relaxed">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkoutOptions;
