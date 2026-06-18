"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { readStoredAuthUserJson } from "@/shared/utils/authTokenStorage";

export default function AuthGate({ children }) {
  const { token: contextToken } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = new Set(["/", "/login", "/register", "/forgot-password", "/reset-password"]);
    const isPublicRoute = publicRoutes.has(pathname);
    const hasSession = Boolean(contextToken || readStoredAuthUserJson());

    if (!hasSession) {
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }

    if (isPublicRoute && (pathname === "/login" || pathname === "/register")) {
      router.replace("/dashboard");
    }
  }, [contextToken, pathname, router]);

  return children;
}
