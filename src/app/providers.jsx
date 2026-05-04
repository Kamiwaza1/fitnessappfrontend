"use client";
<<<<<<< Updated upstream
import { AuthProvider } from '@/context/AuthContext';
=======
import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "@/features/auth/components/AuthGate";
>>>>>>> Stashed changes

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
