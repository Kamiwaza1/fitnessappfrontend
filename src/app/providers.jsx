"use client";

import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "@/features/auth/components/AuthGate";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
