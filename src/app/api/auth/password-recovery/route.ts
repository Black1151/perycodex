import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const { status, ok } = await apiClient("/authentication/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const message =
      "A reset email will be sent if the address provided is valid";

    if (!ok || status !== 200) {
      console.error("Error occurred while sending the reset email.");
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "A reset email will be sent if the address provided is valid",
      },
      { status: 200 }
    );
  }
}
