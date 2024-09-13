import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import axios from "axios";
import apiClient from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const apiToken = request.cookies.get("auth_token")?.value;

  if (!apiToken) {
    return NextResponse.redirect(new URL("/login", request.url));
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
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/"],
};
