import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log(
    "GET /api/tags/getTags params:",
    Object.fromEntries(searchParams)
  );

  try {
    const recordTypeId = searchParams.get("recordTypeId");
    const recordId = searchParams.get("recordId");

    if (!recordTypeId || !recordId) {
      return NextResponse.json(
        { error: "Both recordTypeId and recordId are required." },
        { status: 400 }
      );
    }

    const response = await apiClient(
      `/tagAssociation/allBy?recordTypeId=${recordTypeId}&recordId=${recordId}`
    );

    if (!response.ok) {
      const errorMessage =
        (await response.json())?.error || "Failed to fetch tags.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const tags = await response.json();
    return NextResponse.json(tags);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching tags." },
      { status: 500 }
    );
  }
}
