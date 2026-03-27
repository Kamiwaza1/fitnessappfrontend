"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        setIsLoggingIn(true);

        try {
            // Simulate login API call
            const response = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({ username: "user", password: "password" }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            // Redirect to dashboard after successful login
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Login failed. Please try again.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin} disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}
