"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/features/auth/api/authApi";
import { validateLoginValues } from "@/features/auth/utils/authValidation";

export function useLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const loginRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const scrollToLogin = () => {
    setIsScrolling(true);
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => setIsScrolling(false), 900);
  };

  const setFieldValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    const { normalizedEmail, fieldErrors: nextFieldErrors } = validateLoginValues(values);
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const auth = await loginUser({
        email: normalizedEmail,
        password: values.password,
      });

      login(auth);
      router.push("/dashboard");
    } catch (submissionError) {
      if (submissionError.fieldErrors && Object.keys(submissionError.fieldErrors).length > 0) {
        setFieldErrors(submissionError.fieldErrors);
      }

      setError(submissionError.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loginRef,
    isScrolling,
    values,
    error,
    fieldErrors,
    isSubmitting,
    scrollToLogin,
    setFieldValue,
    handleSubmit,
  };
}
