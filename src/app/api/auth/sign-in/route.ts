import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const response = await apiClient.post("/authentication/login", {
      email,
      password,
    });

    const { token, UUID } = response.data.resource;

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
    const errorMessage = error.response?.data?.error || "An error occurred";

    console.log(errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
