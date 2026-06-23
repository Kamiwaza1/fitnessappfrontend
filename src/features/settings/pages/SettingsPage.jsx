"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PushNotificationsCard from "@/features/settings/components/PushNotificationsCard";
import { deleteCurrentUser, fetchCurrentUser, updateCurrentUser } from "@/features/settings/api/userApi";
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

SettingsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
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
  const [deleteValues, setDeleteValues] = useState({ password: "", confirmation: "" });
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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

  const scheduleAccountDeletion = async (event) => {
    event.preventDefault();
    setDeleteMessage("");
    setDeleteError("");

    if (!deleteValues.password.trim()) {
      setDeleteError("Enter your password to verify this deletion.");
      return;
    }

    if (deleteValues.confirmation !== "DELETE") {
      setDeleteError("Type DELETE to confirm account deletion.");
      return;
    }

    setIsDeletingAccount(true);

    try {
      await deleteCurrentUser({ password: deleteValues.password });
      setDeleteValues({ password: "", confirmation: "" });
      setDeleteMessage("Account deletion scheduled. Check your email for recovery details.");
      globalThis.setTimeout(() => {
        logout();
        router.push("/login");
      }, 1200);
    } catch (error) {
      setDeleteError(error?.message || "Could not schedule account deletion.");
      setIsDeletingAccount(false);
    }
  };

  return (
    <AppPageShell mainClassName="flex h-screen flex-col overflow-hidden">
      

      <section className="custom-scrollbar flex-1 overflow-y-auto p-6 sm:p-8">
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
                    className="flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingTarget ? "Saving..." : "Save target"}
                  </button>
                </div>
              </form>
            </SettingsCard>

            <SettingsCard
              icon="notifications"
              title="Push Notifications"
              description="Receive live workout message alerts even when the tab is closed."
            >
              <PushNotificationsCard />
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
                  <span>New password</span>
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
                  <span>Confirm password</span>
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
                  className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingPassword ? "Updating..." : "Update password"}
                </button>
              </form>
            </SettingsCard>

            <SettingsCard
              icon="warning"
              title="Delete Account"
              description="Schedule permanent deletion after a 7 day recovery window."
            >
              <form onSubmit={scheduleAccountDeletion} className="space-y-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">
                  Your account can be recovered for 7 days. After that, your account and data are permanently deleted.
                </div>

                <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Current password</span>
                  <input
                    autoComplete="current-password"
                    type="password"
                    value={deleteValues.password}
                    onChange={(event) =>
                      setDeleteValues((current) => ({ ...current, password: event.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
                  />
                </label>

                <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Type DELETE</span>
                  <input
                    autoComplete="off"
                    type="text"
                    value={deleteValues.confirmation}
                    onChange={(event) =>
                      setDeleteValues((current) => ({ ...current, confirmation: event.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
                  />
                </label>

                {deleteError ? <StatusMessage tone="error" className="text-left">{deleteError}</StatusMessage> : null}
                {deleteMessage ? <StatusMessage className="text-left text-primary">{deleteMessage}</StatusMessage> : null}

                <button
                  type="submit"
                  disabled={isDeletingAccount || deleteValues.confirmation !== "DELETE"}
                  className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeletingAccount ? "Scheduling deletion..." : "Delete account"}
                </button>
              </form>
            </SettingsCard>
          </div>
        </div>
      </section>
    </AppPageShell>
  );
}
