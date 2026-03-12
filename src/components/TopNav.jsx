"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function TopNav() {
    const navItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Workouts', path: '/workouts' },
        { name: 'Nutrition', path: '/nutrition' },
        { name: 'Progress', path: '/progress' },
    ];

    return (
        <nav className="border-b border-primary/10 bg-background-light dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(13,242,89,0.3)]">
                            <span className="material-icons text-background-dark font-bold">bolt</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white uppercase">Dark Lift</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {navItems.map((item) => {
                            const isActive = usePathname() === item.path;
                            return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={clsx(
                                    "hover:text-primary transition-colors",
                                    isActive && "text-primary border-b-2 border-primary pb-1"
                                )}
                            >
                                {item.name}
                            </Link>
                        )})}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                        <span className="material-icons">notifications</span>
                    </button>
                    <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5">
                        <img
                            className="w-full h-full object-cover rounded-full"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9j4-kI44BvxGaeznWrp9xoY5WnZmMJdHYiQSFRvdDXA9sdQ-ahJELLNPlDB6Ddal87EafVs-2RK3bvPvpmM-3ItfgVa2TGQ-VAMpopScQ2v2QW--WKP6Cpt09kqXrvXVoMvynlEfgDODoQPzIlibaY4w3T-JakhkmJckop1PliKSUedxJlUo3_Js2YmZoqmKObO0DYiTu8JCyXCgnCYz0u7htpUaD7tI_lnfXK0QCr85mAUpQnmQDJ21bstsgTvH0f_TJJ49uUAfl"
                            alt="User"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
