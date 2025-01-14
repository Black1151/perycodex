// index.ts (formerly processResponseData.ts)
import {
  ApiResponseItem,
  DataPoint,
} from "@/app/api/happiness-score/dashboards/getCompanyDashboardData/types";
import { getAllWeekKeysBetween } from "../weekUtils";

import { computeWeeklyStats } from "./helpers/computeWeeklyStats";
import { fetchAndMergeNonParticipants } from "./helpers/fetchAndMergeNonParticipants";
import { buildSpeechBubbleData } from "./helpers/buildSpeechBubbleData";
import { groupByWeeks } from "./helpers/groupByWeeks";
import { findEarliestDate } from "./helpers/findEarliestDate";

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export async function processResponseData(
  apiResponseItems: ApiResponseItem[],
  workflowId: number,
  businessProcessId: number,
  toolConfigId: number,
  preFilter: string | undefined,
  managerOfDeptIds: string[],
  managerOfTeamIds: string[]
) {
  // 1) Earliest date
  const earliestDate = findEarliestDate(apiResponseItems);
  const currentDate = new Date();

  // 2) Group items by weeks
  const weekGroups = groupByWeeks(apiResponseItems);

  // 3) Build a list of all weeks between earliestDate & currentDate
  const allWeekData = getAllWeekKeysBetween(earliestDate, currentDate);

  const dataPointsArray: DataPoint[] = [];
  const weeksData: any[] = [];

  // 4) For each week, compute stats & fetch non-participants
  for (const { weekKey, startDate, endDate } of allWeekData) {
    const entries = weekGroups.get(weekKey) || [];

    // participants
    const {
      avgScore,
      masonryCounts,
      peopleList,
      departmentScores,
      siteScores,
    } = computeWeeklyStats(entries);

    // fetch + merge non-participants
    await fetchAndMergeNonParticipants(
      {
        workflowId,
        businessProcessId,
        toolConfigId,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        preFilter,
        managerOfDeptIds,
        managerOfTeamIds,
      },
      peopleList,
      masonryCounts
    );

    // build department summary

    console.log("departmentscores", departmentScores);

    const departmentsData = Array.from(departmentScores.entries()).map(
      ([deptName, { totalScore, count }]) => ({
        department: deptName,
        averageScore: totalScore / count,
        count,
      })
    );

    // build site summary
    const sitesData = Array.from(siteScores.values()).map((s) => ({
      site: s.mostRecentSiteName,
      averageScore: s.totalScore / s.count,
      count: s.count,
    }));

    dataPointsArray.push({ title: weekKey, value: avgScore });
    weeksData.push({
      weekKey,
      avgScore,
      masonryCounts,
      peopleList,
      departmentsData,
      sitesData,
    });
  }

  // 5) Build speech bubble from the lineGraph
  const speechBubbleData = buildSpeechBubbleData(dataPointsArray);

  // 6) Return final object
  return {
    lineGraphData: dataPointsArray,
    speechBubbleData,
    weeksData,
  };
}
