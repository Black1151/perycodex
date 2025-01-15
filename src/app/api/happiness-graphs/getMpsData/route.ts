import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

interface ManagingPartnersResponse {
  resource: UserStatsResponse;
}

interface UserStatsResponse {
  totalAvg: any;
  gridData: any;
  weeklyLineChartComparisonData: any;
  monthlyLineChartComparisonData: any;
  currentWeekLeaderboard: any;
  leaderboardData: any;
}

export async function GET(request: Request) {
  try {
    // Make the POST request to the external API
    const userResponse = await apiClient("/getManagingPartnersDashboard", {
      method: "POST",
    });

    // Check responses
    if (!userResponse.ok) {
      throw new Error("Failed to fetch happiness score RAG data");
    }

    const managingPartnersResponse: ManagingPartnersResponse =
      await userResponse.json();

    return NextResponse.json({
      resource: managingPartnersResponse.resource,
    });
  } catch (error) {
    console.error(
      "Error fetching happiness score Managing Partners data:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch data from the API." },
      { status: 500 },
    );
  }
}
