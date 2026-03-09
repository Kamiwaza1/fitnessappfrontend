import React from 'react';
import Sidebar from '../components/Sidebar';

export default function ExerciseLibrary() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                            <input className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary" placeholder="Search exercises..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-primary text-background-dark px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
                            <span className="material-icons text-sm">add</span> New Template
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary/20 text-slate-400 hover:text-primary transition-colors">
                            <span className="material-icons">notifications</span>
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Exercises Section */}
                        <div className="col-span-12 xl:col-span-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Exercise Library <span className="text-sm font-normal text-slate-500">(0)</span>
                                </h2>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 rounded-full text-xs bg-primary text-background-dark font-medium">All</button>
                                    <button className="px-3 py-1 rounded-full text-xs border border-primary/20 text-slate-400 hover:border-primary transition-colors">Chest</button>
                                    <button className="px-3 py-1 rounded-full text-xs border border-primary/20 text-slate-400 hover:border-primary transition-colors">Back</button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-100 dark:bg-slate-800/20 rounded-xl border border-dashed border-primary/10">
                                <span className="material-icons text-4xl mb-4 text-slate-600">fitness_center</span>
                                <p>No exercises found.</p>
                                <button className="mt-4 text-primary text-sm font-bold hover:underline">Add Custom Exercise</button>
                            </div>
                        </div>
                        {/* Templates Sidebar Section */}
                        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                            <div className="bg-slate-100 dark:bg-slate-800/30 border border-primary/10 rounded-xl p-6 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Your Templates</h2>
                                    <button className="text-primary hover:underline text-xs font-medium">View All</button>
                                </div>
                                {/* Templates List */}
                                <div className="space-y-4">
                                    <div className="text-center py-8 text-slate-500 text-xs">
                                        No templates created yet.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
