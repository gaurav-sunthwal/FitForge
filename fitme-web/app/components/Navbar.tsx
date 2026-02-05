import React from 'react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-foreground/5 shadow-sm">
            <div className="text-2xl font-bold tracking-tighter text-foreground">
                FitMe
            </div>
            <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Home</a>
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Workouts</a>
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Plan</a>
                <a href="#" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Community</a>
            </div>
            <button className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95">
                Download App
            </button>
        </nav>
    );
};

export default Navbar;
