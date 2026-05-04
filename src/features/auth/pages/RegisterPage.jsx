"use client";

import RegisterForm from "@/features/auth/components/RegisterForm";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

export default function RegisterPage() {
  const { values, error, fieldErrors, isSubmitting, setFieldValue, handleSubmit } =
    useRegisterForm();

  return (
    <RegisterForm
      values={values}
      error={error}
      fieldErrors={fieldErrors}
      isSubmitting={isSubmitting}
      onChange={setFieldValue}
      onSubmit={handleSubmit}
    />
  );
}
