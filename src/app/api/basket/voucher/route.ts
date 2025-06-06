import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * PUT /api/basket/voucher
 * - Updates the current basket with a voucher
 */
export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const backendUrl = `${process.env.BE_URL}/basket`;

  try {
    const response = await fetch(backendUrl, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[BASKET PUT VOUCHER] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to update basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BASKET PUT VOUCHER] Exception caught:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while updating basket." },
      { status: 500 }
    );
  }
}