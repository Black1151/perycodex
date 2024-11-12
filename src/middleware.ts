import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiClient from "./lib/apiClient";

export async function middleware(request: NextRequest) {
  const apiToken = request.cookies.get("auth_token")?.value;

  if (!apiToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_uuid");
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
    return response;
  }

  try {
    const { status, ok } = await apiClient(`/authentication/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!ok || status !== 200) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("user_uuid");
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate",
      );
      return response;
    }

    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
    return response;
  } catch (error: any) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_uuid");
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );
    return response;
  }
}

export const config = {
  matcher: ["/", "/profile-setup"],
};
