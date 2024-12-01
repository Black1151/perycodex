import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/ManagerDashboard";

interface ApiResponse {
  resource: ApiResponseItem[];
}

interface ApiResponseItem {
  userId: number;
  fullName: string;
  deptName: string;
  teamName: string | null;
  siteName: string;
  avgHappinessScore: string;
  stddevHappinessScore: string;
  minHappinessScore: number;
  maxHappinessScore: number;
  totalEntries: number;
  lastMonthHappinessScore: string;
  currentRagStatus: string;
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;

  const body = await request.json();

  const { toolId, workflowId, customerId } = body;

  if (!toolId || !workflowId || !customerId) {
    return NextResponse.json(
      { error: "Missing required fields: toolId, workflowId, or customerId." },
      { status: 400 },
    );
  }

  try {
    // Make the POST request to the external API
    const response = await apiClient("/getHappinessScoreRag", {
      method: "POST",
      body: JSON.stringify({
        toolId: toolId,
        workflowId: workflowId,
        customerId: customerId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch happiness score RAG data");
    }

    const apiResponse: { resource: ApiResponseItem[] } = await response.json();

    return NextResponse.json({
      resource: apiResponse.resource,
    });
  } catch (error) {
    console.error("Error fetching happiness score RAG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from the API." },
      { status: 500 },
    );
  }
}
