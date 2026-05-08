"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  clearStoredAuthToken,
  isTokenExpired,
  readAuthTokenFromCookies,
  readStoredAuthToken,
} from "@/shared/utils/authTokenStorage";

export default function AuthGate({ children }) {
  const { token: contextToken } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = new Set(["/", "/login", "/register"]);
    const isPublicRoute = publicRoutes.has(pathname);
    const token = readStoredAuthToken() || readAuthTokenFromCookies() || contextToken;

    if (!token) {
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }

    if (isTokenExpired(token)) {
      clearStoredAuthToken();
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
