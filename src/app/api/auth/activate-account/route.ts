import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    // Use apiClient with fetch and the POST method
    const response = await apiClient(`/authentication/verifyAccount`, {
      method: "POST",
      body: JSON.stringify({
        verificationToken: token,
        password,
      }),
    });

    // Handle success, generate the redirect URL
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    const res = NextResponse.json({ redirectUrl });
    return res;
  } catch (error: any) {
    const errorMessage = error.message || "An error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
