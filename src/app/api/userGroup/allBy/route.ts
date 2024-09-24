import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    try {
        const response = await fetch(
            `${process.env.BE_URL}/userGroup/allBy`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken ? `Bearer ${authToken}` : "",
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || "Something went wrong");
        }

        const data = await response.json();
        const resource = data.resource;
        return NextResponse.json({ resource });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
