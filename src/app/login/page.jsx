"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/features/auth/api/authApi';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        try {
            const auth = await loginUser({ email, password });
            login(auth.user ?? { email }, auth.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err?.message || "Login failed");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center font-display">
            <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-xl shadow-lg p-8 border border-primary/10 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold tracking-tighter text-primary italic mb-6">DARK LIFT</h1>
                <p className="text-slate-500 dark:text-slate-300 mb-8 text-center">Welcome back! Please log in to continue.</p>
                <form className="w-full flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary"
                        type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg mt-4 hover:bg-primary/90 transition-all flex items-center justify-center space-x-2" type="submit">
                        <span className="material-icons">login</span>
                        <span>Login</span>
                    </button>
                </form>
                {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
                <div className="mt-6 text-xs text-slate-400 text-center">
                    <span> Dont have an account?</span>
                    <a href="/register" className="text-primary font-bold ml-1 hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
}
