import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    // Make the POST request using the new apiClient
    const response = await apiClient("/authentication/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Assuming the response is in JSON format (fetch returns response.json())
    const { token, UUID } = response.resource;

    // Create a redirect URL after successful login
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
    const res = NextResponse.json({ redirectUrl });

    // Set auth_token cookie
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Set user_uuid cookie
    res.cookies.set("user_uuid", UUID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } catch (error: any) {
    // Handle errors from the fetch request
    const errorMessage = error.message || "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
