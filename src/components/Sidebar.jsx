"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/' },
        { name: 'Workouts', icon: 'fitness_center', path: '/workouts' },
        { name: 'Nutrition', icon: 'restaurant', path: '/nutrition' },
        { name: 'Progress', icon: 'insights', path: '/progress' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
        { name: 'Logout', icon: 'logout', path: '/login' },
    ];
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <aside className="w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark/50 hidden lg:flex flex-col sticky top-0 h-screen">
            <div className="p-8">
                <h1 className="text-2xl font-extrabold tracking-tighter text-primary italic">DARK LIFT</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-slate-400 hover:text-primary hover:bg-primary/5"
                            )}
                        >
                            <span className="material-icons">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-6 border-t border-primary/10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <img
                            className="w-full h-full rounded-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQcBtgXEw0VFaRSi3XPmNzdcp32KXAOrKbg7UUoBLGx73i10fq8nY7LjAtsH-SqM-TGV3w5F22O_Mv9PEpo6HgnHY_-XQHYKOasR0aKSsd36w7MDrD1Og0IfJMRsjeGDftJTF5kkSIQUCZNe66KOwHdj6WW17YSZvWxS4vrdFukEVhZl6UUb6-9r5rR3slEVrcP6t26N9BQqGxwKYHAl426QNQ47K8fc3GFWvK7R72LqK0PsiilF1ZwbNv5wnNpukscaUm3mXBIxut"
                            alt="User profile"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold">{user?.fullName || user?.email || user?.username}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
