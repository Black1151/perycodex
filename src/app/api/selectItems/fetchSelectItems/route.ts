import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> route hit");
  const { type } = await req.json();

  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  try {
    const response = await fetch(`${process.env.BE_URL}/selectItem/allBy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error during fetch request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
