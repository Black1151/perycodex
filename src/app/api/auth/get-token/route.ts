import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    console.log("Auth token retrieved:", authToken);

    return NextResponse.json({ authToken });
}
