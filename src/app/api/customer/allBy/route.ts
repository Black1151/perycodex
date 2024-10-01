import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const { status, ok, data } = await apiClient(
      `/customer/allBy?selectColumns=id,name,customerCode,isActive,uniqueId`,
      {
        method: "GET",
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      }
    );

    if (!ok || status !== 200) {
      const errorMessage = data?.error || "Failed to fetch customer data.";
      return NextResponse.json({ error: errorMessage }, { status });
    }
    return NextResponse.json({ resource: data.resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
