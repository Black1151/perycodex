import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!uniqueId) {
    return NextResponse.json(
      { error: "User UUID not found in cookies." },
      { status: 400 }
    );
  }

  const data = await req.json();

  try {
    const {
      status,
      ok,
      data: userData,
    } = await apiClient(`/user/${uniqueId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!ok || status !== 200) {
      const errorMessage = userData?.error || "Failed to update user data.";
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json({ userData });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
