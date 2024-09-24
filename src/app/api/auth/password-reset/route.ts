import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    const response = await apiClient.post(`/authentication/passwordReset`, {
      rememberToken: token,
      password,
    });
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    const res = NextResponse.json({ redirectUrl });
    return res;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
