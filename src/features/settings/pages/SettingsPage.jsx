"use client";

import AppPageShell from "@/shared/components/AppPageShell";

export default function SettingsPage() {
  return (
    <AppPageShell mainClassName="flex h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/50 px-8 backdrop-blur-md dark:bg-background-dark/50">
        <h2 className="text-xl font-bold">Settings</h2>
      </header>

      <section className="custom-scrollbar flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-primary/10 bg-white p-8 shadow-lg dark:bg-background-dark">
            <h3 className="mb-4 text-lg font-semibold">Account Settings</h3>
            <p className="mb-6 text-slate-500 dark:text-slate-300">
              Update your preferences and account information below.
            </p>
            <form className="flex flex-col gap-4">
             
              <input
                className="rounded-lg border border-primary/20 bg-background-light px-4 py-2 text-slate-900 focus:ring-2 focus:ring-primary dark:bg-background-dark dark:text-slate-100"
                type="password"
                placeholder="New Password"
              />
              <button
                className="mt-4 rounded-lg bg-primary py-3 font-bold text-background transition-all hover:bg-primary/90"
                type="submit"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </section>
    </AppPageShell>
  );
}
