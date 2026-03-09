import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex font-display">
            <Sidebar />
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="p-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Welcome back, <span className="text-primary">User</span></h2>
                        <p className="text-slate-400 mt-1">Ready to crush your session today?</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p className="font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <button className="w-10 h-10 rounded-lg bg-background-light dark:bg-background-dark/80 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                            <span className="material-icons">notifications</span>
                        </button>
                    </div>
                </header>
                <div className="px-8 pb-12 space-y-8">
                    {/* Top Section: Stats and Workout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Today Summary (Nutrition Rings) */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-8">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="relative w-40 h-40">
                                    {/* SVG Circle Background */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-primary/10" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="440" strokeWidth="8"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-extrabold italic">0</span>
                                        <span className="text-[10px] uppercase text-slate-400 tracking-widest">/ 2,400 Kcal</span>
                                    </div>
                                </div>
                                <p className="font-bold text-center">Daily Calories</p>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-primary/10" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="440" strokeWidth="8"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-extrabold italic">0g</span>
                                        <span className="text-[10px] uppercase text-slate-400 tracking-widest">/ 180g Protein</span>
                                    </div>
                                </div>
                                <p className="font-bold text-center">Daily Protein</p>
                            </div>
                        </div>
                        {/* Workout Status Card */}
                        <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute -right-4 -top-4 text-primary/10 transform rotate-12 pointer-events-none">
                                <span className="material-icons text-9xl">fitness_center</span>
                            </div>
                            <div>
                                <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Today's Goal</span>
                                <h3 className="text-3xl font-extrabold mt-4 italic">REST DAY</h3>
                                <p className="text-slate-400 mt-2">No active workout scheduled.</p>
                                <div className="flex items-center space-x-4 mt-4 text-sm font-medium">
                                    {/* Empty stats */}
                                </div>
                            </div>
                            <button className="bg-primary text-background-dark font-bold py-4 rounded-lg w-full mt-8 glow-primary hover:bg-primary/90 transition-all flex items-center justify-center space-x-2">
                                <span>START WORKOUT</span>
                                <span className="material-icons">play_arrow</span>
                            </button>
                        </div>
                    </div>
                    {/* Middle Section: Detailed Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Training Volume (Bar Chart) */}
                        <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold uppercase tracking-widest text-sm text-slate-400">Weekly Training Volume</h3>
                                <span className="material-icons text-primary cursor-pointer">bar_chart</span>
                            </div>
                            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
                                No data available
                            </div>
                        </div>
                        {/* Weight Trend (Line Chart Area) */}
                        <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-8 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold uppercase tracking-widest text-sm text-slate-400">Body Weight Trend (kg)</h3>
                                <div className="flex space-x-4">
                                    <span className="text-xs font-bold text-primary">Avg: --</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
                                No data available
                            </div>
                        </div>
                    </div>
                    {/* Bottom Section: Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-6 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
                                <span className="material-icons">water_drop</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Water</p>
                                <p className="text-lg font-bold italic">0 / 3.5L</p>
                            </div>
                        </div>
                        <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-6 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                <span className="material-icons">directions_walk</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Steps</p>
                                <p className="text-lg font-bold italic">0</p>
                            </div>
                        </div>
                        <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-6 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
                                <span className="material-icons">bedtime</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Sleep</p>
                                <p className="text-lg font-bold italic">-- hrs</p>
                            </div>
                        </div>
                        <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl p-6 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center">
                                <span className="material-icons">local_fire_department</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Activity</p>
                                <p className="text-lg font-bold italic">0 kcal</p>
                            </div>
                        </div>
                    </div>
                    {/* Recent Log List */}
                    <div className="bg-background-light dark:bg-white/5 border border-primary/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-primary/10 flex justify-between items-center">
                            <h3 className="font-bold uppercase tracking-widest text-sm">Recent Activity Log</h3>
                            <button className="text-primary text-xs font-bold hover:underline">VIEW ALL</button>
                        </div>
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No recent activity found.
                        </div>
                    </div>
                </div>
            </main>
            {/* Right Quick Actions (Optional Sidebar for Desktop) */}
            <aside className="w-80 border-l border-primary/10 bg-background-light dark:bg-background-dark/30 hidden xl:flex flex-col p-8 space-y-8">
                <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-6">Upcoming Plan</h3>
                    <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                        No upcoming workouts scheduled.
                    </div>
                </div>
                <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-6">Motivational Insight</h3>
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 italic text-sm text-slate-300">
                        "Your journey begins with a single step. Start logging today!"
                        <p className="mt-4 font-bold text-primary not-italic">— AI Coach</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}
