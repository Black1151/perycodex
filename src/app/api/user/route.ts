// app/api/user/route.ts
import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET() {
  try {
    const response = await apiClient.get("/user");
    if (response.status === 200) {
      const userData = response.data;
      return NextResponse.json(userData);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
