import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

interface ApiResponse {
  resource: ApiResponseItem[];
}

interface ApiResponseItem {
  jsonBpRespLite: string;
  jsonBpCreatorDetails: string;
  createdAt: string;
}

export interface ProcessedData {
  happinessScore: number | null;
  comments: string | null;
  siteName: string;
  departmentName: string;
  jobLevel: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  invitationDate?: Date;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupBy = searchParams.get("groupBy");
  const groupValue = searchParams.get("groupValue");
  const category = searchParams.get("category");
  const action = searchParams.get("action");

  const validGroupBys = ["siteName", "departmentName", "jobLevel"];

  if (
    !action ||
    (action !== "linegraph" && action !== "bargraph" && action !== "masonry")
  ) {
    return NextResponse.json(
      { error: "Invalid or missing 'action' parameter." },
      { status: 400 },
    );
  }

  if (
    action !== "linegraph" &&
    (!groupBy || !validGroupBys.includes(groupBy))
  ) {
    return NextResponse.json(
      { error: "Invalid or missing 'groupBy' parameter." },
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;

  try {
    const response = await apiClient(
      "/businessProcess/allInstanceReportsJsonBy?toolConfigId=1&customerId=1",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );

    if (!response.ok || response.status !== 200) {
      const errorMessage = "Failed to fetch data from the API.";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const data: ApiResponse = await response.json();

    const processedData: ProcessedData[] = data.resource.map((item) => {
      const happinessData = JSON.parse(item.jsonBpRespLite);
      const creatorDetails = JSON.parse(item.jsonBpCreatorDetails);

      return {
        happinessScore:
          happinessData.happinessScore !== undefined
            ? happinessData.happinessScore
            : null,
        comments: happinessData.comments || null,
        siteName: creatorDetails.siteName,
        departmentName: creatorDetails.deptName,
        jobLevel: creatorDetails.jobLevel,
        firstName: creatorDetails.firstName,
        lastName: creatorDetails.lastName,
        createdAt: item.createdAt,
      };
    });

    const getCategory = (happinessScore: number): string => {
      if (happinessScore >= 9) return "Very Happy";
      if (happinessScore >= 7) return "Happy";
      if (happinessScore >= 5) return "Neutral";
      if (happinessScore >= 3) return "Unhappy";
      return "Very Unhappy";
    };

    if (action === "linegraph") {
      const getInvitationDate = (submissionDate: Date): Date => {
        const invitationStartDate = new Date("2023-01-02");
        const msInDay = 24 * 60 * 60 * 1000;
        const daysDifference = Math.floor(
          (submissionDate.getTime() - invitationStartDate.getTime()) / msInDay,
        );
        const numberOfPeriods = Math.floor(daysDifference / 14);
        const invitationDate = new Date(
          invitationStartDate.getTime() + numberOfPeriods * 14 * msInDay,
        );
        return invitationDate;
      };

      processedData.forEach((item) => {
        const submissionDate = new Date(item.createdAt);
        item.invitationDate = getInvitationDate(submissionDate);
      });

      let filteredData = processedData;

      if (groupBy && validGroupBys.includes(groupBy)) {
        if (groupValue && groupValue !== "All") {
          filteredData = filteredData.filter(
            (item) => item[groupBy as keyof ProcessedData] === groupValue,
          );
        }
      }

      const groupedData: { [key: string]: { sum: number; count: number } } = {};

      filteredData.forEach((item) => {
        const score = item.happinessScore;
        const key = item.invitationDate!.toISOString().split("T")[0];

        if (score !== null && key) {
          if (!groupedData[key]) {
            groupedData[key] = { sum: 0, count: 0 };
          }
          groupedData[key].sum += score;
          groupedData[key].count += 1;
        }
      });

      const result = Object.keys(groupedData)
        .map((key) => ({
          title: key,
          value: groupedData[key].sum / groupedData[key].count,
        }))
        .sort(
          (a, b) => new Date(a.title).getTime() - new Date(b.title).getTime(),
        );

      return NextResponse.json({ success: true, data: result });
    } else if (action === "bargraph") {
      const groupSums: {
        [key: string]: { sum: number; count: number };
      } = {};

      processedData.forEach((item) => {
        const key = item[groupBy as keyof ProcessedData];
        const score = item.happinessScore;

        if (score !== null && key) {
          const keyString = String(key);
          if (!groupSums[keyString]) {
            groupSums[keyString] = { sum: 0, count: 0 };
          }
          groupSums[keyString].sum += score;
          groupSums[keyString].count += 1;
        }
      });

      const result = Object.keys(groupSums).map((key) => ({
        title: key,
        value: groupSums[key].sum / groupSums[key].count,
      }));

      return NextResponse.json({ success: true, data: result });
    } else if (action === "masonry") {
      if (!category) {
        const filteredData =
          groupValue && groupValue !== "All"
            ? processedData.filter(
                (item) => item[groupBy as keyof ProcessedData] === groupValue,
              )
            : processedData;

        const categoryCounts = {
          "1-2": 0,
          "3-5": 0,
          "6-8": 0,
          "9-10": 0,
          noScore: 0,
        };

        filteredData.forEach((item) => {
          const score = item.happinessScore;
          if (score === null) {
            categoryCounts.noScore += 1;
          } else if (score >= 1 && score <= 2) {
            categoryCounts["1-2"] += 1;
          } else if (score >= 3 && score <= 5) {
            categoryCounts["3-5"] += 1;
          } else if (score >= 6 && score <= 8) {
            categoryCounts["6-8"] += 1;
          } else if (score >= 9 && score <= 10) {
            categoryCounts["9-10"] += 1;
          }
        });

        const result = [
          categoryCounts["1-2"],
          categoryCounts["3-5"],
          categoryCounts["6-8"],
          categoryCounts["9-10"],
          categoryCounts["noScore"],
        ];

        return NextResponse.json({ success: true, data: result });
      } else {
        const filteredData =
          groupValue && groupValue !== "All"
            ? processedData.filter(
                (item) => item[groupBy as keyof ProcessedData] === groupValue,
              )
            : processedData;

        const categoryData = filteredData.filter((item) => {
          const score = item.happinessScore;
          if (score !== null) {
            const cat = getCategory(score);
            return cat === category;
          }
          return false;
        });

        const details = categoryData.map((item) => ({
          firstName: item.firstName,
          lastName: item.lastName,
          departmentName: item.departmentName,
          siteName: item.siteName,
          happinessScore: item.happinessScore,
          comments: item.comments,
        }));

        return NextResponse.json({ success: true, data: details });
      }
    } else {
      return NextResponse.json(
        { error: "Invalid action parameter." },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.message || "An error occurred.";
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 },
    );
  }
}
