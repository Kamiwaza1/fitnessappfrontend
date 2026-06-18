"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { readStoredAuthUserJson } from "@/shared/utils/authTokenStorage";

const PUBLIC_ROUTES = new Set(["/login", "/register", "/forgot-password", "/reset-password"]);

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const hasSession = Boolean(readStoredAuthUserJson());
    const isPublicRoute = PUBLIC_ROUTES.has(pathname);

    if (!hasSession) {
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }

    if (isPublicRoute) {
      router.replace("/");
    }
  }, [pathname, router]);

  return children;
}
