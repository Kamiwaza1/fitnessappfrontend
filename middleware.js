import { NextResponse } from "next/server";
import { isTokenExpired } from "@/shared/utils/authTokenStorage";

function clearAuthCookies(response) {
  response.cookies.set("authToken", "", { maxAge: 0, path: "/" });
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  response.cookies.set("jwt", "", { maxAge: 0, path: "/" });
  response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
  return response;
}

export function middleware(request) {
  const authToken =
    request.cookies.get("authToken")?.value ||
    request.cookies.get("token")?.value ||
    request.cookies.get("jwt")?.value ||
    request.cookies.get("accessToken")?.value;

  if (authToken && isTokenExpired(authToken)) {
    return clearAuthCookies(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
