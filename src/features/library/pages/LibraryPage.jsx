"use client";

import AppPageShell from "@/shared/components/AppPageShell";

export default function LibraryPage() {
  return (
    <AppPageShell mainClassName="flex h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/50 px-8 backdrop-blur-md dark:bg-background-dark/50">
        <div className="flex max-w-xl flex-1 items-center gap-4">
          <div className="relative w-full">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              search
            </span>
            <input
              className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary dark:bg-slate-800/50"
              placeholder="Search exercises..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary/90">
            <span className="material-icons text-sm">add</span> New Template
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 text-slate-400 transition-colors hover:text-primary">
            <span className="material-icons">notifications</span>
          </button>
        </div>
      </header>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                Exercise Library <span className="text-sm font-normal text-slate-500">(0)</span>
              </h2>
              <div className="flex gap-2">
                <button className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-background">
                  All
                </button>
                <button className="rounded-full border border-primary/20 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-primary">
                  Chest
                </button>
                <button className="rounded-full border border-primary/20 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-primary">
                  Back
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/10 bg-slate-100 p-12 text-slate-500 dark:bg-slate-800/20">
              <span className="material-icons mb-4 text-4xl text-slate-600">fitness_center</span>
              <p>No exercises found.</p>
              <button className="mt-4 text-sm font-bold text-primary hover:underline">
                Add Custom Exercise
              </button>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-6 xl:col-span-4">
            <div className="flex h-full flex-col rounded-xl border border-primary/10 bg-slate-100 p-6 dark:bg-slate-800/30">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Templates</h2>
                <button className="text-xs font-medium text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                <div className="py-8 text-center text-xs text-slate-500">
                  No templates created yet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
