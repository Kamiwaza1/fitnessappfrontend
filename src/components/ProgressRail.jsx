import React from 'react';
import { NavLink } from 'react-router-dom';


export default function ProgressRail() {
    return (
        <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 bg-white dark:bg-background-dark/50 border-r border-slate-200 dark:border-primary/10 z-50">
            <div className="mb-12">
                <NavLink to="/" className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-icons text-background-dark text-3xl font-bold">bolt</span>
                </NavLink>
            </div>
            <nav className="flex flex-col gap-8">
                <NavLink to="/" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">dashboard</span></NavLink>
                <NavLink to="/workouts" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">fitness_center</span></NavLink>
                <NavLink to="/progress" className="text-primary"><span className="material-icons">insights</span></NavLink>
                <NavLink to="/nutrition" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">restaurant</span></NavLink>
                <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">person</span></button>
            </nav>
            <div className="mt-auto">
                <button className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons">logout</span></button>
            </div>
        </aside>
    );
}
