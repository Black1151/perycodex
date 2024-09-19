// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const apiToken = cookieStore.get("auth_token")?.value;

    await apiClient.get("/authentication/logout", {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const res = NextResponse.json({ success: true });

    if (cookieStore.get("auth_token")) {
      res.cookies.delete("auth_token");
    }
    if (cookieStore.get("user_uuid")) {
      res.cookies.delete("user_uuid");
    }

    return res;
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error.response?.error || "An error occurred during logout";
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
