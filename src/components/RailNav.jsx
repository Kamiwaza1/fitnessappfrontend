"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
                <Link href="/" className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                    <span className="material-icons text-background-dark font-bold">fitness_center</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-8">
                {navItems.map((item) => {
                    const isActive = usePathname() === item.path;
                    return (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={clsx(
                            "p-3 rounded-xl transition-colors",
                            isActive
                                ? "text-primary bg-primary/10"
                                : "text-slate-400 hover:text-primary"
                        )}
                    >
                        <span className="material-icons">{item.icon}</span>
                    </Link>
                )})}
            </nav>
            <div className="mt-auto">
                <Link href="/settings" className="p-3 text-slate-400 hover:text-red-400 transition-colors block">
                    <span className="material-icons">settings</span>
                </Link>
            </div>
        </aside>
    );
}
