import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import axios from "axios";
import apiClient from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const apiToken = request.cookies.get("auth_token")?.value;

  // Determine if we are in development or production
  const isDev = process.env.NODE_ENV === "development";

  const loginPath = isDev
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/login`
    : "/login";

  if (!apiToken) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  try {
    await apiClient.get(`/authentication/check`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });
    return NextResponse.next();
  } catch (error: any) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/"],
};
