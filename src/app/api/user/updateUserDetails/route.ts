import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!uniqueId) {
    return NextResponse.json(
      { error: "User UUID not found in cookies." },
      { status: 400 }
    );
  }

  let { data } = await req.json();

  try {
    const response = await apiClient(`/user/${uniqueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const userData = await response.json();
    return NextResponse.json({ userData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
