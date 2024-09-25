import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    await apiClient(`/authentication/passwordReset`, {
      method: "POST",
      body: JSON.stringify({
        rememberToken: token,
        password,
      }),
    });

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    const res = NextResponse.json({ redirectUrl });
    return res;
  } catch (error: any) {
    const errorMessage =
      error.message || "An error occurred during the password reset.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
