"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        id: 'ai-vision',
        label: 'AI Vision',
        title: 'Nutritional Intelligence',
        description: 'Snap a photo of your meal and let Gemini AI break down calories, protein, and macros with surgical precision.'
    },
    {
        id: 'analytics',
        label: 'Analytics',
        title: 'Data-Driven Growth',
        description: 'Track your volume, sets, and personal bests with interactive charts that show your evolution over time.'
    },
    {
        id: 'psychology',
        label: 'Reminders',
        title: 'Habit Mastery',
        description: 'Our smart notification system uses behavioral psychology to nudge you exactly when you need it most.'
    },
    {
        id: 'themes',
        label: 'Custom UI',
        title: 'Aesthetic Fitness',
        description: 'Switch between Dark, Light, and Custom themes that match your style and keep you focused.'
    }
];

const FeatureHighlights = () => {
    const [activeTab, setActiveTab] = useState(features[0].id);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            onClick={() => setActiveTab(feature.id)}
                            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === feature.id
                                ? 'bg-foreground text-background shadow-xl scale-105'
                                : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground'
                                }`}
                        >
                            {feature.label}
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto text-center">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{
                                opacity: activeTab === feature.id ? 1 : 0,
                                scale: activeTab === feature.id ? 1 : 0.98,
                                display: activeTab === feature.id ? 'block' : 'none'
                            }}
                            transition={{ duration: 0.4 }}
                        >
                            <h3 className="text-3xl md:text-4xl font-black mb-6 text-foreground tracking-tight">{feature.title}</h3>
                            <p className="text-lg md:text-xl text-foreground/50 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureHighlights;
