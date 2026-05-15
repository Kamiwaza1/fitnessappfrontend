"use client";

import StarBackground from "@/features/auth/components/StarBackground";
import LandingHero from "@/features/auth/components/LandingHero";
import LoginForm from "@/features/auth/components/LoginForm";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

export default function LandingPage() {
  const {
    loginRef,
    isScrolling,
    values,
    error,
    fieldErrors,
    isSubmitting,
    scrollToLogin,
    setFieldValue,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarBackground isScrolling={isScrolling} />
      <main className="relative z-10">
        <LandingHero onGetStarted={scrollToLogin} />
        <LoginForm
          loginRef={loginRef}
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
