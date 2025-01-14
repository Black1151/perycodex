// helpers/computeWeeklyStats.ts
import {
  ApiResponseItem,
  Person,
} from "@/app/api/happiness-score/dashboards/getCompanyDashboardData/types";

/**
 * Data we return after computing stats for the participants of a given week.
 */
export interface WeeklyStatsResult {
  avgScore: number;
  masonryCounts: number[]; // e.g. [1-2, 3-5, 6-8, 9-10, placeholder for non-participants]
  peopleList: Person[];
  departmentScores: Map<string, { totalScore: number; count: number }>;
  siteScores: Map<
    number,
    {
      totalScore: number;
      count: number;
      mostRecentSiteName: string;
      mostRecentCreatedAt: Date;
    }
  >;
}

/**
 * Classify a participant’s numeric score into the correct "masonry bin".
 */
function classifyScore(score: number, masonryCounts: number[]) {
  if (score >= 9)
    masonryCounts[3]++; // 9-10
  else if (score >= 6)
    masonryCounts[2]++; // 6-8
  else if (score >= 3)
    masonryCounts[1]++; // 3-5
  else if (score > 0) masonryCounts[0]++; // 1-2
}

export function computeWeeklyStats(
  entries: { score: number; item: ApiResponseItem }[]
): WeeklyStatsResult {
  let avgScore = 0;
  const masonryCounts = [0, 0, 0, 0, 0]; // The last slot is for non-participants, fill later

  const peopleList: Person[] = [];
  const departmentScores = new Map<
    string,
    { totalScore: number; count: number }
  >();
  const siteScores = new Map<
    number,
    {
      totalScore: number;
      count: number;
      mostRecentSiteName: string;
      mostRecentCreatedAt: Date;
    }
  >();

  if (entries.length > 0) {
    const totalScore = entries.reduce((sum, e) => sum + e.score, 0);
    avgScore = totalScore / entries.length;

    for (const { score, item } of entries) {
      classifyScore(score, masonryCounts);

      // Person
      peopleList.push({
        userId: item.userId,
        imageUrl: item.userImageUrl,
        fullName: item.fullName,
        firstName: item.firstName,
        lastName: item.lastName,
        jobTitle: item.jobTitle,
        department: item.deptName,
        site: item.siteName,
        score,
      });

      // Department grouping
      const deptName = item.deptName;
      if (deptName) {
        if (!departmentScores.has(deptName)) {
          departmentScores.set(deptName, { totalScore: 0, count: 0 });
        }
        const deptData = departmentScores.get(deptName)!;
        deptData.totalScore += score;
        deptData.count += 1;
      }

      // Site grouping
      const siteId = item.siteId;
      if (siteId) {
        if (!siteScores.has(siteId)) {
          siteScores.set(siteId, {
            totalScore: 0,
            count: 0,
            mostRecentSiteName: item.siteName,
            mostRecentCreatedAt: new Date(item.createdAt),
          });
        }
        const siteData = siteScores.get(siteId)!;
        siteData.totalScore += score;
        siteData.count += 1;

        const itemCreatedAt = new Date(item.createdAt);
        if (itemCreatedAt > siteData.mostRecentCreatedAt) {
          siteData.mostRecentCreatedAt = itemCreatedAt;
          siteData.mostRecentSiteName = item.siteName;
        }
      }
    }
  }

  return {
    avgScore,
    masonryCounts,
    peopleList,
    departmentScores,
    siteScores,
  };
}
