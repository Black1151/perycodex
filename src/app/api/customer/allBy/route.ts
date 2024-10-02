import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const response = await apiClient(
      `/customer/allBy?selectColumns=id,name,customerCode,isActive,uniqueId`,
      {
        method: "GET",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || response.status !== 200) {
      const errorMessage = data?.error || "Failed to fetch customer data.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}
