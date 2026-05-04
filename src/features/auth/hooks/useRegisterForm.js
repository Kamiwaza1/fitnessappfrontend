"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/features/auth/api/authApi";
import { validateRegisterValues } from "@/features/auth/utils/authValidation";

export function useRegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { normalizedName, normalizedEmail, fieldErrors: nextFieldErrors } = validateRegisterValues(values);
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("Please correct the highlighted fields and try again.");
      return;
    }

    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const auth = await registerUser({
        fullName: normalizedName,
        email: normalizedEmail,
        password: values.password,
      });

      login(auth.user ?? { email: normalizedEmail, fullName: normalizedName }, auth.accessToken);
      router.push("/workouts");
    } catch (submissionError) {
      if (submissionError.fieldErrors && Object.keys(submissionError.fieldErrors).length > 0) {
        setFieldErrors(submissionError.fieldErrors);
      }

      setError(submissionError.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    error,
    fieldErrors,
    isSubmitting,
    setFieldValue,
    handleSubmit,
  };
}
