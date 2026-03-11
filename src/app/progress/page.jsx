"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function ProgressDashboard() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex">
            <Sidebar />
            <main className="flex-1 p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Progress &amp; <span className="text-primary">Insights</span></h1>
                        <p className="text-slate-500 dark:text-slate-400">Long-term performance analysis and physical metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-200 dark:bg-white/5 p-1 rounded-lg flex">
                            <button className="px-4 py-1.5 text-xs font-medium rounded-md hover:bg-white/10 transition-colors">7D</button>
                            <button className="px-4 py-1.5 text-xs font-medium rounded-md bg-primary text-background-dark">30D</button>
                            <button className="px-4 py-1.5 text-xs font-medium rounded-md hover:bg-white/10 transition-colors">3M</button>
                            <button className="px-4 py-1.5 text-xs font-medium rounded-md hover:bg-white/10 transition-colors">1Y</button>
                        </div>
                        <button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all">
                            <span className="material-icons text-sm">download</span> Export
                        </button>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Volume</span>
                            <span className="material-icons text-primary">fitness_center</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold">0</span>
                            <span className="text-slate-500 text-xs font-medium mb-1.5 flex items-center"> -- %</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 italic">lbs moved this month</p>
                    </div>
                    {/* ... other KPIs ... */}
                </div>

                {/* Dashboard Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Muscle Volume Radar & AI Insights */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                        {/* Volume Radar Chart */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 h-full">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="material-icons text-primary text-sm">analytics</span> Volume Per Muscle Group
                            </h3>
                            <div className="relative aspect-square flex items-center justify-center p-4">
                                <div className="text-slate-500 text-sm">Not enough data for chart</div>
                            </div>
                        </div>
                        {/* AI Insights Sidebar */}
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-icons text-primary">psychology</span>
                                <h4 className="font-bold text-sm tracking-tight">AI TRAINER INSIGHTS</h4>
                            </div>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">•</span>
                                    <p className="text-slate-300">Keep logging your workouts to unlock personalized insights.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Main Data Columns */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                        {/* Body Measurements History */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-icons text-primary text-sm">show_chart</span> Body Metric Trends
                                </h3>
                            </div>
                            <div className="h-64 w-full relative flex items-center justify-center text-slate-500 text-sm">
                                No measurements recorded.
                            </div>
                        </div>
                        {/* Personal Records Table */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-icons text-primary text-sm">stars</span> Recent Personal Records
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                            <th className="px-6 py-4">Exercise</th>
                                            <th className="px-6 py-4">Max Weight</th>
                                            <th className="px-6 py-4">1RM Est.</th>
                                            <th className="px-6 py-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-xs">
                                                No personal records yet. Crush some weights!
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
