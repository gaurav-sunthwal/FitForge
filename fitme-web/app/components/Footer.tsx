import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 overflow-hidden rounded-t-[4rem]">
            {/* Ticker / Big Text */}
            <div className="whitespace-nowrap flex space-x-12 mb-24 opacity-20 select-none pointer-events-none">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="text-[10vw] font-black uppercase tracking-tighter">
                        Work With Us • Work With Us • Work With Us •
                    </div>
                ))}
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Empowering Every Step of Fitness!</h3>
                        <p className="text-gray-400 max-w-xs leading-relaxed text-sm">
                            Your transformation is just one tap away. Join the FitMe community today.
                        </p>
                        <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all shadow-lg">
                            Download App
                        </button>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">About</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">Social</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:row items-center justify-between gap-6 text-xs text-gray-500">
                    <p>© 2024 FitMe App. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Cookies</a>
                    </div>
                    <button className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors">
                        ↑
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
