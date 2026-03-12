"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function NutritionDiary() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex">
            <Sidebar />
            <main className="flex-1 max-w-[1600px] mx-auto px-6 py-8">
                {/* Header & Date Picker */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 text-primary transition-colors">
                            <span className="material-icons">chevron_left</span>
                        </button>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">Today's Diary</h1>
                            <p className="text-slate-500 dark:text-primary/60 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <button className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 text-primary transition-colors">
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>
                    {/* Global Targets Bar */}
                    <div className="flex-1 max-w-2xl bg-slate-900/40 dark:bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-around">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Consumed</div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">2,500</div>
                            <div className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Remaining</div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                    <span>Protein</span>
                                    <span className="text-primary">0g/180g</span>
                                </div>
                                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                    <span>Carbs</span>
                                    <span className="text-sky-400">0g/250g</span>
                                </div>
                                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-sky-400" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                    <span>Fats</span>
                                    <span className="text-amber-400">0g/70g</span>
                                </div>
                                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-8">
                    {/* Left: Meal Logs */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Breakfast Section */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden group">
                            <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                        <span className="material-icons text-sm">wb_twilight</span>
                                    </div>
                                    <h2 className="text-lg font-bold">Breakfast</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-bold">0 kcal</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">P: 0g | C: 0g | F: 0g</div>
                                    </div>
                                    <button className="p-1.5 bg-primary text-background-dark rounded hover:scale-105 transition-transform">
                                        <span className="material-icons text-base leading-none">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No food logged for breakfast.
                                </div>
                            </div>
                        </section>
                        {/* Lunch Section */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                            <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                        <span className="material-icons text-sm">light_mode</span>
                                    </div>
                                    <h2 className="text-lg font-bold">Lunch</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-bold">0 kcal</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">P: 0g | C: 0g | F: 0g</div>
                                    </div>
                                    <button className="p-1.5 bg-primary text-background-dark rounded hover:scale-105 transition-transform">
                                        <span className="material-icons text-base leading-none">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No food logged for lunch.
                                </div>
                            </div>
                        </section>
                        {/* Snacks Section */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                            <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                        <span className="material-icons text-sm">cookie</span>
                                    </div>
                                    <h2 className="text-lg font-bold">Snacks</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-bold">0 kcal</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">P: 0g | C: 0g | F: 0g</div>
                                    </div>
                                    <button className="p-1.5 bg-primary text-background-dark rounded hover:scale-105 transition-transform">
                                        <span className="material-icons text-base leading-none">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No food logged for snacks.
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Supplement Section */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                            <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                        <span className="material-icons text-sm">pill</span>
                                    </div>
                                    <h2 className="text-lg font-bold">Supplement</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-bold">0 kcal</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">P: 0g | C: 0g | F: 0g</div>
                                    </div>
                                    <button className="p-1.5 bg-primary text-background-dark rounded hover:scale-105 transition-transform">
                                        <span className="material-icons text-base leading-none">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No food logged for lunch.
                                </div>
                            </div>
                        </section>
                    {/* Right: Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Quick Add / Search */}
                        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 p-6 sticky top-24">
                            <div className="relative mb-6">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                                <input className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search foods database..." type="text" />
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Insights</h3>
                                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                                    <div className="flex gap-3">
                                        <span className="material-icons text-primary">tips_and_updates</span>
                                        <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-300">
                                            Start logging your meals to get personalized nutrition insights.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Water Tracker */}
                        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-sky-400">water_drop</span>
                                    <span className="text-sm font-bold">Water Intake</span>
                                </div>
                                <span className="text-sm font-bold text-sky-400">0 / 3L</span>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => <div key={i} className="flex-1 h-3 bg-sky-400/20 rounded-full"></div>)}
                                {[1, 2].map(i => <div key={i} className="flex-1 h-3 bg-sky-400/20 rounded-full"></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
