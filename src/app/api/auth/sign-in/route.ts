import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const { status, ok, data } = await apiClient("/authentication/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!ok || status !== 200) {
      const errorMessage = data?.error || "Invalid login credentials";
      return NextResponse.json({ error: errorMessage }, { status });
    }

    const { token, UUID } = data.resource;

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
    const res = NextResponse.json({ redirectUrl });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookies.set("user_uuid", UUID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.message || "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
