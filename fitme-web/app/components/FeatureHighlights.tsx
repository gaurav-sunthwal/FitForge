"use client"
import React, { useState } from 'react';

const features = [
    {
        id: 'goals',
        label: 'Plan Goals',
        title: 'Smart Goals',
        description: 'Set personalized weight targets, calorie ceilings, and weekly workout frequencies tailored to your body.'
    },
    {
        id: 'consistency',
        label: 'Challenges',
        title: 'Consistency tracking',
        description: 'Turn discipline into a habit with streak tracking and visual calendars that celebrate every workout.'
    },
    {
        id: 'themes',
        label: 'Themes',
        title: 'Sleek Themes',
        description: 'Experience the app with a sleek, premium design tailored for a high-end feel.'
    },
    {
        id: 'ai',
        label: 'AI Analysis',
        title: 'AI Analysis',
        description: 'Leverage Gemini AI to analyze your meal photos and get instant nutritional insights (Protein, Calories, Macros).'
    }
];

const FeatureHighlights = () => {
    const [activeTab, setActiveTab] = useState(features[0].id);

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            onClick={() => setActiveTab(feature.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === feature.id
                                ? 'bg-foreground text-background shadow-lg'
                                : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
                                }`}
                        >
                            {feature.label}
                        </button>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto text-center transition-all duration-500">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={`${activeTab === feature.id ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'} transition-all duration-500`}
                        >
                            <h3 className="text-3xl font-bold mb-4 text-foreground">{feature.title}</h3>
                            <p className="text-xl text-foreground/60 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureHighlights;
