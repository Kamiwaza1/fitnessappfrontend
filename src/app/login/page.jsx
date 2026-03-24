"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { storeAuthToken } from '@/lib/authToken';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const readToken = (data) => (
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.data?.token ||
        data?.data?.accessToken ||
        data?.result?.token ||
        ""
    );

    const handleLogin = async () => {
        if (isSubmitting) return;

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setError("");
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail, password }),
            });

            let data = {};
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            if (!res.ok) {
                if (res.status === 401) {
                    setError("Invalid email or password.");
                    return;
                }
                setError(data?.message || data?.error || `Login failed (${res.status})`);
                return;
            }

            const token = readToken(data);
            if (token && typeof window !== "undefined") {
                storeAuthToken(token);
            }

            router.push("/");
        } catch (err) {
            setError("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 font-display">
            <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-xl shadow-lg p-5 sm:p-8 border border-primary/10 flex flex-col items-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-primary italic mb-4 sm:mb-6">DARK LIFT</h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-300 mb-6 sm:mb-8 text-center">Welcome back! Please log in to continue.</p>
                <form className="w-full flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
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
                        <span className="material-icons">login</span>
                        <span>{isSubmitting ? "Logging in..." : "Login"}</span>
                    </button>
                </form>
                {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
                <div className="mt-5 sm:mt-6 text-xs sm:text-sm text-slate-400 text-center">
                    <span> Dont have an account?</span>
                    <a href="/register" className="text-primary font-bold ml-1 hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
}
