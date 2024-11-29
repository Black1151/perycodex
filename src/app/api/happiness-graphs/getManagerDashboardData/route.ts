// File: pages/api/happiness-graphs/getManagerDashboardData.ts

import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/ManagerDashboard";

interface ApiResponse {
  resource: ApiResponseItem[];
}

interface Tag {
  tagId: number;
  name: string;
}

interface ApiResponseItem {
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  fullName: string;
  employStartDate: string;
  userImageUrl: string;
  userIsActive: boolean;
  userUniqueId: string;
  customerId: number;
  customerName: string;
  companyNo: string;
  customerCode: string;
  customerType: string;
  customerParentName: string | null;
  customerParentId: number | null;
  companySizeId: number;
  companySizeName: string;
  customerIsActive: boolean;
  businessTypeName: string;
  businessTypeId: number;
  siteName: string;
  siteId: number;
  teamName: string;
  teamId: number;
  jobLevelName: string;
  jobLevelId: number;
  deptName: string;
  deptId: number;
  regionName: string;
  regionId: number;
  sectorName: string;
  sectorId: number;
  contractTypeName: string;
  contractTypeId: number;
  multiSite: boolean;
  noOfSites: number;
  noOfUsers: number;
  numberOfEmployees: number;
  webAddress: string;
  remoteWorker: boolean;
  jsonBpRespFull: string;
  jsonBpRespLite: string;
  createdAt: string;
  createdBy: number;
  toolConfigId: number;
  workflowId: number;
  businessProcessId: number;
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  userTags?: Tag[];
  siteTags?: Tag[];
  customerTags?: Tag[];
}

interface DataPoint {
  value: number;
  title: string;
}

interface SpeechBubbleData {
  currentScore: number;
  change: number;
  positiveChange: boolean;
}

interface Person {
  userId: number;
  imageUrl: string;
  fullName: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  site: string;
  score: number;
}

function camelCaseToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

const getWeekNumber = (date: Date): [number, number] => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNo = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return [target.getFullYear(), weekNo];
};

function getAllWeekKeysBetween(startDate: Date, endDate: Date): string[] {
  const weeks: string[] = [];
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  currentDate.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));

  while (currentDate <= endDate) {
    const [year, weekNo] = getWeekNumber(currentDate);
    const weekKey = `${year}-W${weekNo}`;
    if (!weeks.includes(weekKey)) {
      weeks.push(weekKey);
    }
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weeks;
}

export async function GET(request: Request) {
  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const timeRange = queryParams.timeRange || "all";

  const selectedFilters = {
    siteId: queryParams.siteId?.split(",") || [],
    jobLevel: queryParams.jobLevel?.split(",") || [],
    deptId: queryParams.deptId?.split(",") || [],
    teamId: queryParams.teamId?.split(",") || [],
    contractTypeId: queryParams.contractTypeId?.split(",") || [],
    role: queryParams.role?.split(",") || [],
    remoteWorker: queryParams.remoteWorker === "true" ? ["true"] : [],
    userTagId: queryParams.userTagId?.split(",") || [],
    siteTagId: queryParams.siteTagId?.split(",") || [],
    customerTagId: queryParams.customerTagId?.split(",") || [],
  };

  const workflowId = queryParams.workflowId || 1;
  const businessProcessId = queryParams.businessProcessId || 1;
  const toolConfigId = queryParams.toolConfigId || 1;

  const filterGroups = [
    { key: "deptName", paramName: "deptId" },
    { key: "teamName", paramName: "teamId" },
    { key: "role", paramName: "role" },
    { key: "jobLevelName", paramName: "jobLevel" },
    { key: "contractTypeName", paramName: "contractTypeId" },
    { key: "remoteWorker", paramName: "remoteWorker" },
    { key: "siteName", paramName: "siteId" },
    { key: "userTags", paramName: "userTagId" },
    { key: "siteTags", paramName: "siteTagId" },
    { key: "customerTags", paramName: "customerTagId" },
  ];

  const keyToIdMapping: Record<string, string> = {
    deptName: "deptId",
    teamName: "teamId",
    jobLevelName: "jobLevelId",
    contractTypeName: "contractTypeId",
    siteName: "siteId",
    userTags: "tagId",
    siteTags: "tagId",
    customerTags: "tagId",
  };

  const buildEndpoint = (filters: any) => {
    let endpoint = `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;
    Object.keys(filters).forEach((key) => {
      if (filters[key]?.length) {
        endpoint += `&${key}=${filters[key].join(",")}`;
      }
    });

    console.log(endpoint);

    return endpoint;
  };

  function getStartDateFromTimeRange(timeRange: string): Date | null {
    const now = new Date();
    switch (timeRange) {
      case "1 month":
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case "3 months":
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case "6 months":
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case "1 year":
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case "all":
      default:
        return null;
    }
  }

  const startDate = getStartDateFromTimeRange(timeRange);

  // Use Promise.all to fetch filter options in parallel
  const filterGroupPromises = filterGroups.map(async (group) => {
    const filtersExcludingCurrentGroup = { ...selectedFilters } as Record<
      string,
      string[]
    >;
    delete filtersExcludingCurrentGroup[group.paramName];

    const endpoint = buildEndpoint(filtersExcludingCurrentGroup);

    console.log("ENDPOINT", endpoint);

    try {
      const response = await apiClient(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${group.key}`);
      }

      const dataForGroup: ApiResponse = await response.json();

      // Collect all options for the current group
      const optionsSet = new Map<string, { label: string; value: string }>();

      for (const item of dataForGroup.resource) {
        let dataField = item[group.key as keyof ApiResponseItem];

        if (
          group.key === "userTags" ||
          group.key === "siteTags" ||
          group.key === "customerTags"
        ) {
          if (typeof dataField === "string") {
            try {
              dataField = JSON.parse(dataField);
            } catch (error) {
              console.error(`Error parsing ${group.key} for item`, item, error);
              dataField = [];
            }
          }

          if (Array.isArray(dataField)) {
            for (const tag of dataField) {
              if (tag && tag.tagId && tag.name) {
                optionsSet.set(String(tag.tagId), {
                  label: tag.name,
                  value: String(tag.tagId),
                });
              }
            }
          }
        } else {
          const label = dataField;
          const idKey = keyToIdMapping[group.key];
          const value = idKey ? item[idKey as keyof ApiResponseItem] : label;
          if (label && label !== "null") {
            optionsSet.set(String(value), {
              label: String(label),
              value: String(value),
            });
          }
        }
      }

      const options = Array.from(optionsSet.values());

      const groupLabels: Record<string, string> = {
        userTags: "User Tags",
        siteTags: "Site Tags",
        customerTags: "Customer Tags",
        // Add more custom labels if needed
      };

      return {
        label: groupLabels[group.key] || camelCaseToWords(group.key),
        options: options,
      };
    } catch (error) {
      console.error("Error fetching data for group:", group.key, error);
      return null; // Handle the error as needed
    }
  });

  // Wait for all filter group promises to resolve
  const filterGroupResults = await Promise.all(filterGroupPromises);

  // Filter out any null results
  const availableOptions = filterGroupResults.filter(
    (result) => result !== null
  ) as FilterOptionGroup[];

  const endpointWithAllFilters = buildEndpoint(selectedFilters);

  let finalData: ApiResponse = { resource: [] };

  try {
    const response = await apiClient(endpointWithAllFilters, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch final data");
    }

    finalData = await response.json();
  } catch (error) {
    console.error("Error fetching final data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from the API." },
      { status: 500 }
    );
  }

  // Process the data
  const weekGroups = new Map<
    string,
    { score: number; item: ApiResponseItem }[]
  >();

  let earliestDate: Date | null = startDate || null;

  for (const item of finalData.resource) {
    const respFull = JSON.parse(item.jsonBpRespFull);
    const happinessScore = parseFloat(respFull.happinessScore);

    const createdAt = new Date(item.createdAt);

    if (startDate && createdAt < startDate) {
      continue;
    }
    if (!earliestDate || createdAt < earliestDate) {
      earliestDate = createdAt;
    }

    const [year, weekNo] = getWeekNumber(createdAt);
    const weekKey = `${year}-W${weekNo}`;

    if (!weekGroups.has(weekKey)) {
      weekGroups.set(weekKey, []);
    }
    weekGroups.get(weekKey)?.push({ score: happinessScore, item });
  }

  if (!earliestDate) {
    earliestDate = startDate || new Date();
  }

  const currentDate = new Date();

  const allWeekKeys = getAllWeekKeysBetween(earliestDate, currentDate);

  const dataPointsArray: DataPoint[] = [];
  const weeksData: any[] = [];

  for (const weekKey of allWeekKeys) {
    const entries = weekGroups.get(weekKey) || [];

    if (entries.length > 0) {
      const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
      const avgScore = totalScore / entries.length;

      dataPointsArray.push({
        title: weekKey,
        value: avgScore,
      });

      const masonryCounts = [0, 0, 0, 0, 0];
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

      entries.forEach(({ score, item }) => {
        if (score >= 9) masonryCounts[3]++;
        else if (score >= 6) masonryCounts[2]++;
        else if (score >= 3) masonryCounts[1]++;
        else if (score > 0) masonryCounts[0]++;
        else masonryCounts[4]++;

        peopleList.push({
          userId: item.userId,
          imageUrl: item.userImageUrl,
          fullName: item.fullName,
          firstName: item.firstName,
          lastName: item.lastName,
          jobTitle: item.jobLevelName,
          department: item.deptName,
          site: item.siteName,
          score: score,
        });

        const deptName = item.deptName;
        if (deptName) {
          if (!departmentScores.has(deptName)) {
            departmentScores.set(deptName, { totalScore: 0, count: 0 });
          }
          const deptData = departmentScores.get(deptName)!;
          deptData.totalScore += score;
          deptData.count += 1;
        }

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
      });

      const departmentsData: {
        department: string;
        averageScore: number;
        count: number;
      }[] = [];
      departmentScores.forEach((value, key) => {
        departmentsData.push({
          department: key,
          averageScore: value.totalScore / value.count,
          count: value.count,
        });
      });

      const sitesData: { site: string; averageScore: number; count: number }[] =
        [];
      siteScores.forEach((value, key) => {
        sitesData.push({
          site: value.mostRecentSiteName,
          averageScore: value.totalScore / value.count,
          count: value.count,
        });
      });

      weeksData.push({
        weekKey,
        avgScore,
        masonryCounts,
        peopleList,
        departmentsData,
        sitesData,
      });
    } else {
      dataPointsArray.push({
        title: weekKey,
        value: 0,
      });

      weeksData.push({
        weekKey,
        avgScore: 0,
        masonryCounts: [0, 0, 0, 0, 0],
        peopleList: [],
        departmentsData: [],
        sitesData: [],
      });
    }
  }

  let speechBubbleData: SpeechBubbleData = {
    currentScore: 0,
    change: 0,
    positiveChange: true,
  };
  if (dataPointsArray.length >= 2) {
    const currentWeekAverage = dataPointsArray[dataPointsArray.length - 1];
    const previousWeekAverage = dataPointsArray[dataPointsArray.length - 2];
    const change = currentWeekAverage.value - previousWeekAverage.value;
    speechBubbleData = {
      currentScore: currentWeekAverage.value,
      change: Math.abs(change),
      positiveChange: change >= 0,
    };
  } else if (dataPointsArray.length === 1) {
    speechBubbleData = {
      currentScore: dataPointsArray[0].value,
      change: 0,
      positiveChange: true,
    };
  }

  return NextResponse.json({
    filterOptions: availableOptions,
    lineGraphData: dataPointsArray,
    speechBubbleData,
    weeksData,
    data: finalData.resource,
  });
}
