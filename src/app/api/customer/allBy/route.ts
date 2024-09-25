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

    const resource = response.resource;
    return NextResponse.json({ resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
