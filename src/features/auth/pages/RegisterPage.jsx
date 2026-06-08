"use client";

import StarBackground from "@/features/auth/components/StarBackground";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

export default function RegisterPage() {
  const { values, error, fieldErrors, isSubmitting, setFieldValue, handleSubmit } =
    useRegisterForm();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <main className="relative z-10">
        <RegisterForm
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
