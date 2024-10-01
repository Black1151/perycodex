import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const apiToken = cookieStore.get("auth_token")?.value;

    if (!apiToken) {
      return NextResponse.json(
        { error: "No authentication token found." },
        { status: 401 }
      );
    }
    const { status, ok, data } = await apiClient("/authentication/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
    if (!ok || status !== 200) {
      const errorMessage = data?.error || "Logout failed.";
      return NextResponse.json({ error: errorMessage }, { status });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.delete("auth_token");
    res.cookies.delete("user_uuid");

    return res;
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.message || "An error occurred during logout.";
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
