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
    const res = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login`
    );
    res.cookies.delete("auth_token");
    if (cookieStore.get("auth_token")) {
      res.cookies.delete("auth_token");
    }
    return res;
  } catch (error: any) {
    console.log(error);
    const errorMessage = error.response?.error;
    return NextResponse.json({ error: errorMessage }, { status: error.status });
  }
}
