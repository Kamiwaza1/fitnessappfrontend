"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        setError("");
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
                credentials: "include"
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Registration failed");
                return;
            }
            let data = {};
            try {
                data = await res.json();
            } catch (err) {
                console.log('Failed to parse register response', err);
            }
            // Set user in context (if API returns user object) or fallback to provided values
            login(data.user || { fullName, email });
            router.push("/");
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center font-display">
            <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-xl shadow-lg p-8 border border-primary/10 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold tracking-tighter text-primary italic mb-6">DARK LIFT</h1>
                <p className="text-slate-500 dark:text-slate-300 mb-8 text-center">Create your account to get started.</p>
                <form className="w-full flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />
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
                        <span className="material-icons">person_add</span>
                        <span>Register</span>
                    </button>
                </form>
                {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
                <div className="mt-6 text-xs text-slate-400 text-center">
                    <span>Already have an account?</span>
                    <a href="/login" className="text-primary font-bold ml-1 hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
}
