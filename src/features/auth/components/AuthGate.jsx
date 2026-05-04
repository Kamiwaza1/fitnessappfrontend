"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  clearStoredAuthToken,
  isTokenExpired,
  readStoredAuthToken,
} from "@/shared/utils/authTokenStorage";

export default function AuthGate({ children }) {
  const { token: contextToken } = useAuth();

  useEffect(() => {
    const token = readStoredAuthToken() || contextToken;
    if (!token) return;

    if (isTokenExpired(token)) {
      clearStoredAuthToken();
    }
  }, [contextToken]);

  return children;
}
