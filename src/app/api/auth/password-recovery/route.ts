import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    await apiClient.post("/authentication/passwordReminder", {
      email,
    });

    const res = NextResponse.json(
      {
        message: "A reset email will be sent if the address provided is valid",
      },
      { status: 200 }
    );

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "A reset email will be sent if the address provided is valid",
      },
      { status: 200 }
    );
  }
}
