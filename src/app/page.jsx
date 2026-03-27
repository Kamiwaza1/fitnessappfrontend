import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FirstPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGetStarted = () => {
        setIsLoading(true);
        setTimeout(() => {
            router.push("/login");
        }, 1000);
    };

    useEffect(() => {
        setIsLoading(false); 
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    Welcome to Dark Lift - Your Ultimate Fitness Companion!
                </h1>
                <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                    Get ready to elevate your fitness journey with personalized workout plans, nutrition tracking, and progress monitoring. Click the button below to get started!
                </p>
                <button
                    onClick={handleGetStarted}
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
                >
                    {isLoading ? "Loading..." : "Get Started"}
                </button>
            </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1>Login Page</h1>
        </div>
    );
}