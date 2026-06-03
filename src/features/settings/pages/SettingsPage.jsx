"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchCurrentUser, updateCurrentUser } from "@/features/settings/api/userApi";
import { saveCalorieTarget, useCalorieTarget } from "@/features/settings/utils/calorieTargetStorage";
import AppPageShell from "@/shared/components/AppPageShell";
import StatusMessage from "@/shared/components/StatusMessage";

function getPasswordIssue(password) {
  if (!password) return "Enter a new password.";
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (password.length > 128) return "Password must be 128 characters or fewer.";
  if (/\s/.test(password)) return "Password cannot contain spaces.";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
  if (!/\d/.test(password)) return "Add at least one number.";
  if (!/[@$!%*?&]/.test(password)) return "Add at least one special character: @$!%*?&.";
  return "";
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-slate-900/50">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-lg bg-primary/15 p-2 text-primary">
          <span className="material-icons text-lg">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const savedCalorieTarget = useCalorieTarget();
  const [calorieTarget, setCalorieTarget] = useState("");
  const [hasEditedTarget, setHasEditedTarget] = useState(false);
  const [targetMessage, setTargetMessage] = useState("");
  const [targetError, setTargetError] = useState("");
  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [passwordValues, setPasswordValues] = useState({ password: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const currentUser = await fetchCurrentUser();
        if (!isMounted) return;

        const target = currentUser?.dailyCalorieTarget;
        if (target) {
          setCalorieTarget(String(target));
          setHasEditedTarget(true);
          saveCalorieTarget(target);
        }
      } catch {
        // Keep the cached target visible if the profile endpoint is unavailable.
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveTarget = async (event) => {
    event.preventDefault();
    setTargetMessage("");
    setTargetError("");

    const displayedCalorieTarget = hasEditedTarget ? calorieTarget : String(savedCalorieTarget || "");
    const nextTarget = Number(displayedCalorieTarget);
    if (!Number.isFinite(nextTarget) || nextTarget < 1 || nextTarget > 10000) {
      setTargetError("Calorie target must be between 1 and 10,000 kcal.");
      return;
    }

    setIsSavingTarget(true);

    try {
      const updatedUser = await updateCurrentUser({ dailyCalorieTarget: Math.round(nextTarget) });
      const savedTarget = updatedUser?.dailyCalorieTarget ?? Math.round(nextTarget);
      saveCalorieTarget(savedTarget);
      setCalorieTarget(String(savedTarget));
      setHasEditedTarget(true);
      setTargetMessage("Calorie target saved.");
    } catch (error) {
      setTargetError(error?.message || "Could not save calorie target.");
    } finally {
      setIsSavingTarget(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    const passwordIssue = getPasswordIssue(passwordValues.password);
    if (passwordIssue) {
      setPasswordError(passwordIssue);
      return;
    }

    if (passwordValues.password !== passwordValues.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await updateCurrentUser({ password: passwordValues.password });
      setPasswordValues({ password: "", confirmPassword: "" });
      setPasswordMessage("Password updated.");
    } catch (error) {
      setPasswordError(error?.message || "Could not update password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

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
                      value={hasEditedTarget ? calorieTarget : String(savedCalorieTarget || "")}
                      onChange={(event) => {
                        setHasEditedTarget(true);
                        setCalorieTarget(event.target.value);
                      }}
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
