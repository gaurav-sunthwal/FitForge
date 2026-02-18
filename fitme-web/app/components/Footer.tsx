"use client"
import React from 'react';

const Footer = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-black text-white pt-24 pb-12 overflow-hidden rounded-t-[4rem]">
            {/* Ticker / Big Text */}
            <div className="whitespace-nowrap flex space-x-12 mb-28 opacity-10 select-none pointer-events-none">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="text-[12vw] font-black uppercase tracking-tighter leading-none">
                        REDEFINE STRENGTH • STAY CONSISTENT •
                    </div>
                ))}
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white leading-tight">Empowering Every<br />Step of Fitness!</h3>
                        <p className="text-gray-500 max-w-xs leading-relaxed text-sm">
                            Your transformation is just one tap away. Join the FitMe community today.
                        </p>
                        <button
                            onClick={() => window.open('https://apps.apple.com', '_blank')}
                            className="bg-white text-black px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg"
                        >
                            Download App
                        </button>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] text-gray-500">Navigation</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                            <li><button onClick={() => scrollToSection('workouts')} className="hover:text-white transition-colors">Training</button></li>
                            <li><button onClick={() => scrollToSection('download')} className="hover:text-white transition-colors">Download</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] text-gray-500">Social</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] text-gray-500">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                    <p>© 2024 FitMe App. Built for Performance.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                    </div>
                    <button
                        onClick={() => scrollToSection('home')}
                        className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all group active:scale-90"
                    >
                        <span className="group-hover:-translate-y-1 transition-transform">↑</span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
