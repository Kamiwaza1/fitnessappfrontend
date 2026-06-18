"use client";

import { useState } from "react";
import Link from "next/link";
import StarBackground from "@/features/auth/components/StarBackground";
import { requestPasswordReset } from "@/features/auth/api/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    setFieldError("");
    setError("");
    setMessage("");

    if (!normalizedEmail) {
      setFieldError("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset({ email: normalizedEmail });
      setMessage(response?.message || "If this email exists, a reset link has been sent.");
    } catch (submissionError) {
      setFieldError(submissionError?.fieldErrors?.email || "");
      setError(submissionError?.message || "Could not request password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <Card className="w-full max-w-md border-primary/20 bg-card p-2 backdrop-blur-xl">
          <CardHeader className="text-center">
            <p className="mb-2 text-2xl font-extrabold italic tracking-tighter text-primary">DARK LIFT</p>
            <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
            <CardDescription>Enter your account email to receive a reset link.</CardDescription>
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
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldError("");
                  }}
                  required
                  autoComplete="email"
                  className={fieldError ? "border-red-500/80 ring-2 ring-red-500/30" : ""}
                />
                {fieldError ? <p className="text-xs text-red-300">{fieldError}</p> : null}
              </div>

              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full rounded-full tracking-[0.05em]">
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-primary/60">
              Remembered it?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
