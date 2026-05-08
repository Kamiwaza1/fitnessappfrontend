"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { name: "Workouts", icon: "fitness_center", path: "/workouts" },
  { name: "Nutrition", icon: "restaurant", path: "/nutrition" },
  { name: "Progress", icon: "insights", path: "/progress" },
  { name: "Settings", icon: "settings", path: "/settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-primary/10 bg-background-light dark:bg-background-dark/50 lg:flex">
      <div className="p-8">
        <h1 className="text-2xl font-extrabold tracking-tighter text-primary italic">DARK LIFT</h1>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={clsx(
                "flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors",
                isActive
                  ? "border border-primary/20 bg-primary/10 text-primary"
                  : "text-slate-400 hover:bg-primary/5 hover:text-primary",
              )}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="material-icons">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      <div className="border-t border-primary/10 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/20">
            <Image
              className="h-full w-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQcBtgXEw0VFaRSi3XPmNzdcp32KXAOrKbg7UUoBLGx73i10fq8nY7LjAtsH-SqM-TGV3w5F22O_Mv9PEpo6HgnHY_-XQHYKOasR0aKSsd36w7MDrD1Og0IfJMRsjeGDftJTF5kkSIQUCZNe66KOwHdj6WW17YSZvWxS4vrdFukEVhZl6UUb6-9r5rR3slEVrcP6t26N9BQqGxwKYHAl426QNQ47K8fc3GFWvK7R72LqK0PsiilF1ZwbNv5wnNpukscaUm3mXBIxut"
              alt="User profile"
              width={40}
              height={40}
            />
          </div>
          <div>
            <p suppressHydrationWarning className="text-sm font-bold">
              {user?.fullName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
