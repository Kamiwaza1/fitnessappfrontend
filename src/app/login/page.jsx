"use client";

import StarBackground from "@/features/auth/components/StarBackground";
import LoginForm from "@/features/auth/components/LoginForm";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

export default function LoginPage() {
  const { values, error, fieldErrors, isSubmitting, setFieldValue, handleSubmit } = useLoginForm();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <main className="relative z-10">
        <LoginForm
          values={values}
          error={error}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          onChange={setFieldValue}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
