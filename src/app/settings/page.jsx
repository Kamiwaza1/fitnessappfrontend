"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
	return (
		<div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-display">
			<Sidebar />
			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				{/* Top Header */}
				<header className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
					<h2 className="text-xl font-bold">Settings</h2>
				</header>
				{/* Content Body */}
				<div className="flex-1 overflow-y-auto custom-scrollbar p-8">
					<div className="max-w-2xl mx-auto">
						{/* Settings content goes here */}
						<div className="bg-white dark:bg-background-dark rounded-xl shadow-lg p-8 border border-primary/10">
							<h3 className="text-lg font-semibold mb-4">Account Settings</h3>
							<p className="text-slate-500 dark:text-slate-300 mb-6">Update your preferences and account information below.</p>
							{/* Example settings form */}
							<form className="flex flex-col gap-4">
								<input className="px-4 py-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary" type="email" placeholder="Email" />
								<input className="px-4 py-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary" type="password" placeholder="New Password" />
								<button className="bg-primary text-background-dark font-bold py-3 rounded-lg mt-4 hover:bg-primary/90 transition-all" type="submit">Save Changes</button>
							</form>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
