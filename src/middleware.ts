import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiClient from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const apiToken = request.cookies.get("auth_token")?.value;

  // If no auth token exists, redirect to the login page
  if (!apiToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  }

  try {
    // Use apiClient to check authentication
    await apiClient(`/authentication/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    // Allow the request to continue if authentication succeeds
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  } catch (error: any) {
    // Handle 401/403 errors and redirect to login page
    if (error.status === 401 || error.status === 403) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      return response;
    }

    // Redirect to a generic error page for other errors
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/", "/profile-setup"],
};
