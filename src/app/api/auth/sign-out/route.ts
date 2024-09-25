// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const apiToken = cookieStore.get("auth_token")?.value;

    // Use apiClient with a GET request for logout
    await apiClient("/authentication/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const res = NextResponse.json({ success: true });

    // Delete auth_token and user_uuid cookies
    res.cookies.delete("auth_token");
    res.cookies.delete("user_uuid");

    return res;
  } catch (error: any) {
    // Adjusted error handling for fetch
    const errorMessage = error.message || "An error occurred during logout";
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
