import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    // Convert form data into JSON instead of URLSearchParams
    const requestBody = JSON.stringify({ email });

    // Using apiClient with JSON content type
    const response = await apiClient("/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody, // Pass the JSON request body
    });

    if (!response.ok) {
      const errorMessage =
        response.data?.error || "An error occurred during registration";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.error(error);

    const errorMessage =
      error.message || "An error occurred during registration";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
