"use client"
import React from 'react';

const Navbar = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-100 w-full max-w-5xl px-4">
            <nav className="flex items-center justify-between px-8 py-4 bg-zinc-950/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div
                    className="text-2xl font-black tracking-tighter text-white cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => scrollToSection('home')}
                >
                    FITME<span className="text-blue-500 italic">.</span>
                </div>
                <div className="hidden md:flex items-center space-x-10">
                    <button onClick={() => scrollToSection('home')} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all hover:tracking-[0.3em]">Home</button>
                    <button onClick={() => scrollToSection('features')} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all hover:tracking-[0.3em]">Features</button>
                    <button onClick={() => scrollToSection('workouts')} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all hover:tracking-[0.3em]">Training</button>
                    <button onClick={() => scrollToSection('download')} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all hover:tracking-[0.3em]">Download</button>
                </div>
                <button
                    onClick={() => scrollToSection('download')}
                    className="bg-white text-black px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                    Start Now
                </button>
            </nav>
        </div>
    );
};

export default Navbar;
