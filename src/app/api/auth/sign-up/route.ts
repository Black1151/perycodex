import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const formData = new URLSearchParams();
    formData.append("email", email);

    await apiClient.post("/authentication/register", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    const errorMessage = error.response?.data.error;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
