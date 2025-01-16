import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";

interface ManagingPartnersResponse {
  resource: UserStatsResponse;
}

interface UserStatsResponse {
  totalAvg: any;
  gridData: any;
  weeklyLineChartComparisonData: any; // API returns this as a string
  monthlyLineChartComparisonData: any; // API returns this as a string
  currentWeekLeaderboard: any;
  leaderboardData: any;
}

/**
 * Transforms raw data of shape:
 * [ { week or monthEnd, siteScores: { siteName: number, ... } }, ...]
 * into an array of objects with top-level site fields, e.g.:
 * [
 *   { week: '2024-01-07', 'Site A': 7.11, 'Site B': 8.0 },
 *   { week: '2024-01-14', 'Site A': 7.48, 'Site B': 7.71 },
 * ]
 */
function flattenSiteScores(rawData: any[] | undefined, xKey: string): any[] {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item) => {
    const transformed: Record<string, any> = {
      [xKey]: item[xKey],
    };

    if (item.siteScores && typeof item.siteScores === "object") {
      for (const [siteName, score] of Object.entries(item.siteScores)) {
        transformed[siteName] = score;
      }
    }

    return transformed;
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate } = body;

    const userResponse = await apiClient("/getManagingPartnersDashboard", {
      method: "POST",
      body: JSON.stringify({
        startDate,
        endDate,
      }),
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch happiness score RAG data");
    }

    const managingPartnersResponse: ManagingPartnersResponse =
      await userResponse.json();

    const rawGridDataStr = managingPartnersResponse.resource.gridData;
    const rawWeeklyStr =
      managingPartnersResponse.resource.weeklyLineChartComparisonData;
    const rawMonthlyStr =
      managingPartnersResponse.resource.monthlyLineChartComparisonData;
    const rawCurrentWeekLeaderboardStr =
      managingPartnersResponse.resource.currentWeekLeaderboard;
    const rawLeaderboardDataStr =
      managingPartnersResponse.resource.leaderboardData;

    const rawGridData = JSON.parse(rawGridDataStr || "[]");
    const rawWeeklyData = JSON.parse(rawWeeklyStr || "[]");
    const rawMonthlyData = JSON.parse(rawMonthlyStr || "[]");
    const rawCurrentWeekLeaderboardData = JSON.parse(
      rawCurrentWeekLeaderboardStr || "[]",
    );
    const rawLeaderboardDataData = JSON.parse(rawLeaderboardDataStr || "[]");

    // 3) Flatten them
    const flattenedWeekly = flattenSiteScores(rawWeeklyData, "week");
    const flattenedMonthly = flattenSiteScores(rawMonthlyData, "month");

    // 4) Overwrite original string fields with the new arrays
    const transformedResource = {
      ...managingPartnersResponse.resource,
      gridData: rawGridData,
      weeklyLineChartComparisonData: flattenedWeekly,
      monthlyLineChartComparisonData: flattenedMonthly,
      currentWeekLeaderboard: rawCurrentWeekLeaderboardData,
      leaderboardData: rawLeaderboardDataData,
    };

    console.log(managingPartnersResponse.resource.totalAvg);

    // 5) Return the final JSON
    return NextResponse.json({
      resource: transformedResource,
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
