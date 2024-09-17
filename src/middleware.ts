import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import apiClient from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const apiToken = request.cookies.get("auth_token")?.value;

  if (!apiToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  }

  try {
    await apiClient.get(`/authentication/check`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  } catch (error: any) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      return response;
    }

    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/", "/profile-setup"],
};
