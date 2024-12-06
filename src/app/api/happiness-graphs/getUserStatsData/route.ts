import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

interface UserApiResponse {
  resource: UserStatsResponse;
}

interface UserStatsResponse {
  userScores: ScoreDistribution[];
  userDistribution: Scores[];
  comparativeData: ComparativeScores[];
  monthlyComparativeData: MonthlyComparativeScores[];
  userSubmissions: UserSubmissions[];
}

interface ScoreDistribution {
  count: number;
  score: number;
}

interface Scores {
  score: number;
  countOfScore: number;
  dayOfSubmission: string;
}

interface ComparativeScores {
  site: number;
  user: number;
  company: number;
  department: number;
  weekEnd: string;
  weekStart: string;
}

interface MonthlyComparativeScores {
  site: number;
  user: number;
  company: number;
  department: number;
  monthEnd: string;
  monthStart: string;
}

interface UserSubmissions {
  date: string;
  comments: string;
  happinessScore: number;
  fullName: string;
  userUniqueId: string;
  userImageUrl: string;
  siteName: string;
  departmentName: string;
}

export async function GET(request: Request) {
  try {
    // Make the POST request to the external API
    const userResponse = await apiClient("/getUserHappinessStats", {
      method: "POST",
    });

    // Check responses
    if (!userResponse.ok) {
      throw new Error("Failed to fetch happiness score RAG data");
    }

    const userApiResponse: UserApiResponse = await userResponse.json();

    return NextResponse.json({
      resource: userApiResponse.resource,
    });
  } catch (error) {
    console.error("Error fetching happiness score RAG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from the API." },
      { status: 500 },
    );
  }
}
