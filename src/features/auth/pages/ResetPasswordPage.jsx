"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StarBackground from "@/features/auth/components/StarBackground";
import { resetPassword } from "@/features/auth/api/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function getPasswordIssue(password) {
  if (!password) return "Password is required";
  if (password.length < 12 || password.length > 128) return "Password must be between 12 and 128 characters";
  if (/\s/.test(password)) return "Password cannot contain spaces";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter";
  if (!/\d/.test(password)) return "Add at least one number";
  if (!/[@$!%*?&]/.test(password)) return "Add at least one special character: @$!%*?&";
  return "";
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [values, setValues] = useState({ code: "", password: "", confirmPassword: "" });
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState(token ? "" : "Reset token is missing or invalid.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = (field, value) => {
    const nextValue = field === "code" ? value.replace(/\D/g, "").slice(0, 6) : value;
    setValues((current) => ({ ...current, [field]: nextValue }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (!isCodeConfirmed) {
      if (!/^\d{6}$/.test(values.code)) {
        setFieldErrors({ code: "Enter the 6-digit security code" });
        return;
      }
      setIsCodeConfirmed(true);
      return;
    }

    const passwordIssue = getPasswordIssue(values.password);
    if (passwordIssue) {
      setFieldErrors({ password: passwordIssue });
      return;
    }
    if (values.password !== values.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await resetPassword({ token, code: values.code, newPassword: values.password });
      setValues({ code: "", password: "", confirmPassword: "" });
      setIsCodeConfirmed(false);
      setMessage(response?.message || "Password has been reset successfully.");
    } catch (submissionError) {
      setFieldErrors(submissionError?.fieldErrors || {});
      setError(submissionError?.message || "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-primary/20 bg-card p-2 backdrop-blur-xl">
      <CardHeader className="text-center">
        <p className="mb-2 text-2xl font-extrabold italic tracking-tighter text-primary">DARK LIFT</p>
        <CardTitle className="text-2xl font-bold">
          {isCodeConfirmed ? "Set new password" : "Enter security code"}
        </CardTitle>
        <CardDescription>
          {isCodeConfirmed
            ? "Choose a strong password for your account."
            : "Use the 6-digit code from your reset email."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
              Security code
            </label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={values.code}
              onChange={(event) => setFieldValue("code", event.target.value)}
              required
              autoComplete="one-time-code"
              disabled={isCodeConfirmed || Boolean(message)}
              className={fieldErrors.code ? "border-red-500/80 ring-2 ring-red-500/30" : ""}
            />
            {fieldErrors.code ? <p className="text-xs text-red-300">{fieldErrors.code}</p> : null}
          </div>

          {isCodeConfirmed ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
                  New password
                </label>
                <Input
                  type="password"
                  value={values.password}
                  onChange={(event) => setFieldValue("password", event.target.value)}
                  required
                  autoComplete="new-password"
                  className={fieldErrors.password ? "border-red-500/80 ring-2 ring-red-500/30" : ""}
                />
                {fieldErrors.password ? <p className="text-xs text-red-300">{fieldErrors.password}</p> : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.1em] text-primary/60">
                  Confirm password
                </label>
                <Input
                  type="password"
                  value={values.confirmPassword}
                  onChange={(event) => setFieldValue("confirmPassword", event.target.value)}
                  required
                  autoComplete="new-password"
                  className={fieldErrors.confirmPassword ? "border-red-500/80 ring-2 ring-red-500/30" : ""}
                />
                {fieldErrors.confirmPassword ? <p className="text-xs text-red-300">{fieldErrors.confirmPassword}</p> : null}
              </div>
            </>
          ) : null}

          <Button type="submit" disabled={isSubmitting || !token} size="lg" className="w-full rounded-full tracking-[0.05em]">
            {isSubmitting ? "Updating..." : isCodeConfirmed ? "Update password" : "Continue"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-primary/60">
          Back to{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
