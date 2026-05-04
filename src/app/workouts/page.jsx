<<<<<<< Updated upstream
"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function WorkoutLogger() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-display">
            <Sidebar />
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header & Timer Bar */}
                <header className="flex items-center justify-between px-8 py-6 border-b border-primary/10 bg-background-dark/30 backdrop-blur-md">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Current Session<span className="text-slate-500 ml-2 text-sm font-medium px-2 py-0.5 bg-slate-800 rounded">INACTIVE</span></h1>
                        <p className="text-slate-400 text-sm mt-1">Start a workout to track your progress</p>
                    </div>
                    {/* Rest Timer Widget */}
                    <div className="flex items-center gap-6 bg-slate-900/50 border border-primary/20 p-2 pl-6 rounded-full opacity-50 pointer-events-none">
                        <div className="flex flex-col items-end">
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Rest Timer</span>
                            <span className="text-2xl font-bold text-primary leading-tight">00:00</span>
                        </div>
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="3"></circle>
                            </svg>
                            <span className="material-icons absolute text-xs text-primary">play_arrow</span>
                        </div>
                        <button className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex items-center justify-center transition-all">
                            <span className="material-icons">replay</span>
                        </button>
                    </div>
                </header>

                {/* Workout Logging Scrollable Area */}
                <section className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-32 flex flex-col items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <span className="material-icons text-4xl">fitness_center</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Active Workout</h3>
                        <p className="text-slate-400 mb-8">Select a template from the library or start a quick freestyle workout.</p>
                        <button className="px-8 py-3 bg-primary text-background-dark font-bold rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center gap-2 mx-auto">
                            START FREESTYLE <span className="material-icons">play_arrow</span>
                        </button>
                    </div>
                </section>

                {/* Fixed Bottom Action Bar */}
                <footer className="absolute bottom-0 left-0 right-[320px] bg-background-dark/80 backdrop-blur-xl border-t border-primary/10 p-6 flex justify-between items-center z-20">
                    <div className="flex gap-4">
                        {/* Disabled buttons for empty state */}
                    </div>
                </footer>
            </main>

            {/* Right Sidebar: Exercise Library */}
            <aside className="w-80 bg-slate-900 border-l border-primary/10 flex flex-col h-screen z-20">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-bold mb-4">Exercise Library</h2>
                    <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                        <input className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary" placeholder="Search exercises..." type="text" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {/* Empty State for library sidebar */}
                    <div className="text-center py-8 text-slate-500 text-xs">
                        Use the search bar to find exercises.
                    </div>
                </div>
            </aside>
        </div>
    );
}
=======
import WorkoutsPage from "@/features/workouts/pages/WorkoutsPage";

export default WorkoutsPage;
>>>>>>> Stashed changes
