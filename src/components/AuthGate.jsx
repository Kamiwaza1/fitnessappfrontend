"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredAuthToken, isTokenExpired, readStoredAuthToken } from "@/lib/authToken";

const PUBLIC_ROUTES = new Set(["/login", "/register"]);

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const token = readStoredAuthToken();
    const isPublicRoute = PUBLIC_ROUTES.has(pathname);

    if (!token) {
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }

    if (isTokenExpired(token)) {
      clearStoredAuthToken();
      router.replace("/login");
      return;
    }

    if (isPublicRoute) {
      router.replace("/");
    }
  }, [pathname, router]);

  return children;
}
