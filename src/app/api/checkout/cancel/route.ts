import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  console.log(
    "[CANCEL] Incoming request to cancel sub"
  );

  const backendUrl = `${process.env.BE_URL}/payment/subscription`;

  console.log("[CANCEL] Backend URL:", backendUrl);

  try {
    const body = await req.json();

    console.log("[CANCEL] Request body:", body);

    const response = await fetch(`${backendUrl}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    const data = await response.json();
    console.log("[CANCEL] Backend response:", data);

    if (!response.ok) {
      console.error("[CANCEL] Backend error:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to create basket." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[CANCEL] Exception caught:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An error occurred while checking out basket post payment.",
      },
      { status: 500 }
    );
  }
}
