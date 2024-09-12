import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const uniqueId = cookieStore.get("user_uuid")?.value;

  let { data } = await req.json();

  try {
    const response = await apiClient.put(`/user/${uniqueId}`, { ...data });
    const userData = response.data.resource;
    const res = NextResponse.json({ userData });
    return res;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
