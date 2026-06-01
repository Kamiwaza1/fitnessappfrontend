"use client";

import AppPageShell from "@/shared/components/AppPageShell";

export default function SettingsPage() {
  return (
    <AppPageShell mainClassName="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-primary/10 bg-background-light/80 px-4 py-3 backdrop-blur-md sm:px-8 dark:bg-background-dark/80">
        <div>
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="text-xs text-slate-500">Account security and nutrition preferences</p>
        </div>
      </header>

      <section className="custom-scrollbar flex-1 p-4 sm:p-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <SettingsCard
              icon="person"
              title="Account"
              description="Your signed-in profile for this workspace."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-background-dark">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</div>
                  <div className="mt-1 font-semibold">{user?.fullName || "Not set"}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-background-dark">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</div>
                  <div className="mt-1 truncate font-semibold">{user?.email || user?.username || "Not set"}</div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              icon="local_fire_department"
              title="Calorie Target"
              description="Used by dashboard and nutrition summaries when set."
            >
              <form onSubmit={saveTarget} className="space-y-4">
                <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daily calorie target
                  <div className="mt-1 flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-background-dark">
                    <input
                      min="1"
                      max="10000"
                      type="number"
                      value={calorieTarget}
                      onChange={(event) => setCalorieTarget(event.target.value)}
                      className="w-full min-w-0 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none dark:text-white"
                    />
                    <span className="grid w-16 shrink-0 place-items-center border-l border-slate-200 text-xs normal-case tracking-normal text-slate-400 dark:border-white/10">
                      kcal
                    </span>
                  </div>
                </label>

                {targetError ? <StatusMessage tone="error" className="text-left">{targetError}</StatusMessage> : null}
                {targetMessage ? <StatusMessage className="text-left text-primary">{targetMessage}</StatusMessage> : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSavingTarget}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="material-icons text-base">save</span>
                    {isSavingTarget ? "Saving..." : "Save target"}
                  </button>
                </div>
              </form>
            </SettingsCard>
          </div>

          <div className="space-y-6">
            <SettingsCard
              icon="lock_reset"
              title="Security"
              description="Update your password from a dedicated security section."
            >
              <form onSubmit={savePassword} className="space-y-4">
                <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  New password
                  <input
                    autoComplete="new-password"
                    type="password"
                    value={passwordValues.password}
                    onChange={(event) =>
                      setPasswordValues((current) => ({ ...current, password: event.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
                  />
                </label>

                <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Confirm password
                  <input
                    autoComplete="new-password"
                    type="password"
                    value={passwordValues.confirmPassword}
                    onChange={(event) =>
                      setPasswordValues((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
                  />
                </label>

                <div className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 dark:bg-background-dark dark:text-slate-400">
                  Use 12+ characters with uppercase, lowercase, number, and one of @$!%*?&.
                </div>

                {passwordError ? <StatusMessage tone="error" className="text-left">{passwordError}</StatusMessage> : null}
                {passwordMessage ? <StatusMessage className="text-left text-primary">{passwordMessage}</StatusMessage> : null}

                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-icons text-base">lock_reset</span>
                  {isSavingPassword ? "Updating..." : "Update password"}
                </button>
              </form>
            </SettingsCard>
          </div>
        </div>
      </section>
    </AppPageShell>
  );
}
