import React from 'react';
import Image from 'next/image';

const HealthStrength = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 text-center">
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase bg-foreground/5 text-foreground/60 rounded-full">
                    Holistic Health
                </span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 text-foreground">
                    Elevate <span className="text-foreground/40">Health</span><br />And Strength
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Real-Time Data",
                            desc: "Track calories, protein, and water intake with precision to ensure your fuel matches your ambition.",
                            img: "/images/fitness_watch.png"
                        },
                        {
                            title: "Mind & Body",
                            desc: "Balance your hard training with recovery and mindfulness to ensure long-term fitness sustainability.",
                            img: "/images/meditating_woman.png"
                        },
                        {
                            title: "Visual Transformation",
                            desc: "Securely log and compare your gym progress photos to see the real results of your hard work over time.",
                            img: "/images/workout_bg.png"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col text-left">
                            <div className="group relative aspect-4/5 rounded-[2.5rem] overflow-hidden bg-foreground/5 border border-foreground/10 mb-6 transition-all hover:shadow-2xl">
                                <Image src={feature.img} alt={feature.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                {feature.title === "Visual Transformation" && (
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center gap-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex-1 bg-background p-4 rounded-2xl border border-foreground/10 text-center shadow-xl">
                                            <div className="text-xl mb-1">📷</div>
                                            <p className="text-[10px] font-bold text-foreground uppercase tracking-tighter">Take</p>
                                        </div>
                                        <div className="flex-1 bg-background p-4 rounded-2xl border border-foreground/10 text-center shadow-xl">
                                            <div className="text-xl mb-1">🖼️</div>
                                            <p className="text-[10px] font-bold text-foreground uppercase tracking-tighter">Upload</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-foreground/60 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HealthStrength;
