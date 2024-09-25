import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const formData = new URLSearchParams();
    formData.append("email", email);

    await apiClient("/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    // Adjusted error handling for fetch
    const errorMessage =
      error.message || "An error occurred during registration";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
