"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { storeAuthToken } from '@/lib/authToken';

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = fullName.trim();

        if (!normalizedName || !normalizedEmail || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName: normalizedName, email: normalizedEmail, password }),
            });
            if (!res.ok) {
                let data = {};
                try {
                    data = await res.json();
                } catch {
                    data = {};
                }
                setError(data?.message || data?.error || "Registration failed");
                return;
            }
            const data = await res.json();
            const token = data?.token || data?.accessToken || data?.jwt;
            if (token && typeof window !== "undefined") {
                storeAuthToken(token);
            }
            router.push("/");
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 font-display">
            <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-xl shadow-lg p-5 sm:p-8 border border-primary/10 flex flex-col items-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-primary italic mb-4 sm:mb-6">DARK LIFT</h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-300 mb-6 sm:mb-8 text-center">Create your account to get started.</p>
                <form className="w-full flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
                    <input
                        className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 text-sm sm:text-base focus:ring-2 focus:ring-primary"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 text-sm sm:text-base focus:ring-2 focus:ring-primary"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 text-sm sm:text-base focus:ring-2 focus:ring-primary"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg mt-2 sm:mt-4 hover:bg-primary/90 transition-all flex items-center justify-center space-x-2" type="submit">
                        <span className="material-icons">person_add</span>
                        <span>Register</span>
                    </button>
                </form>
                {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
                <div className="mt-5 sm:mt-6 text-xs sm:text-sm text-slate-400 text-center">
                    <span>Already have an account?</span>
                    <a href="/login" className="text-primary font-bold ml-1 hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
}
