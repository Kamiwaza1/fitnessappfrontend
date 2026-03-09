import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function RailNav() {
    const navItems = [
        { name: 'Timer', icon: 'timer', path: '/timer' }, // Placeholder paths
        { name: 'Stats', icon: 'bar_chart', path: '/progress' },
        { name: 'Nutrition', icon: 'restaurant', path: '/nutrition' },
        { name: 'Calendar', icon: 'calendar_today', path: '/calendar' },
    ];

    return (
        <aside className="w-20 flex flex-col items-center py-8 border-r border-primary/10 bg-background-light dark:bg-background-dark/50">
            <div className="mb-12">
                <NavLink to="/" className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                    <span className="material-icons text-background-dark font-bold">fitness_center</span>
                </NavLink>
            </div>
            <nav className="flex flex-col gap-8">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "p-3 rounded-xl transition-colors",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-slate-400 hover:text-primary"
                            )
                        }
                    >
                        <span className="material-icons">{item.icon}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto">
                <NavLink to="/settings" className="p-3 text-slate-400 hover:text-red-400 transition-colors block">
                    <span className="material-icons">settings</span>
                </NavLink>
            </div>
        </aside>
    );
}
