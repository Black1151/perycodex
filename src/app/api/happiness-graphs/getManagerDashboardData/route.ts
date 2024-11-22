// import { NextResponse } from "next/server";
// import apiClient from "@/lib/apiClient";
// import { cookies } from "next/headers";
// import {
//   FilterOption,
//   FilterOptionGroup,
// } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/page";

// interface ApiResponse {
//   resource: ApiResponseItem[];
// }

// interface ApiResponseItem {
//   role: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   userId: number;
//   fullName: string;
//   employStartDate: string;
//   userImageUrl: string;
//   userIsActive: boolean;
//   userUniqueId: string;
//   customerId: number;
//   customerName: string;
//   companyNo: string;
//   customerCode: string;
//   customerType: string;
//   customerParentName: string | null;
//   customerParentId: number | null;
//   companySizeId: number;
//   companySizeName: string;
//   customerIsActive: boolean;
//   businessTypeName: string;
//   businessTypeId: number;
//   siteName: string;
//   siteId: number;
//   teamName: string;
//   teamId: number;
//   jobLevelName: string;
//   jobLevelId: number;
//   deptName: string;
//   deptId: number;
//   regionName: string;
//   regionId: number;
//   sectorName: string;
//   sectorId: number;
//   contractTypeName: string;
//   contractTypeId: number;
//   multiSite: boolean;
//   noOfSites: number;
//   noOfUsers: number;
//   numberOfEmployees: number;
//   webAddress: string;
//   remoteWorker: boolean;
//   jsonBpRespFull: string;
//   jsonBpRespLite: string;
//   createdAt: string;
//   createdBy: number;
//   toolConfigId: number;
//   workflowId: number;
//   businessProcessId: number;
//   workflowInstanceId: number;
//   businessProcessInstanceId: number;
// }

// interface DataPoint {
//   value: number;
//   title: string;
// }

// interface SpeechBubbleData {
//   currentScore: number;
//   change: number;
//   positiveChange: boolean;
// }

// function camelCaseToWords(str: string): string {
//   return str
//     .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
//     .replace(/^./, (char) => char.toUpperCase());
// }

// const getWeekNumber = (date: Date): [number, number] => {
//   const target = new Date(date.valueOf());
//   const dayNr = (date.getDay() + 6) % 7;
//   target.setDate(target.getDate() - dayNr + 3);
//   const firstThursday = target.valueOf();
//   target.setMonth(0, 1);
//   if (target.getDay() !== 4) {
//     target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
//   }
//   const weekNo = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
//   return [target.getFullYear(), weekNo];
// };

// export async function GET(request: Request) {
//   const cookieStore = cookies();
//   const apiToken = cookieStore.get("auth_token")?.value;

//   // Parse query parameters sent from the client
//   const url = new URL(request.url);
//   const queryParams = Object.fromEntries(url.searchParams.entries());

//   const selectedFilters = {
//     siteId: queryParams.siteId?.split(",") || [],
//     jobLevel: queryParams.jobLevel?.split(",") || [],
//     deptId: queryParams.deptId?.split(",") || [],
//     teamId: queryParams.teamId?.split(",") || [],
//     contractTypeId: queryParams.contractTypeId?.split(",") || [],
//     role: queryParams.role?.split(",") || [],
//     remoteWorker: queryParams.remoteWorker === "true" ? ["true"] : [],
//   };

//   const workflowId = queryParams.workflowId || 1;
//   const businessProcessId = queryParams.businessProcessId || 1;
//   const toolConfigId = queryParams.toolConfigId || 1;

//   // Define filter groups
//   const filterGroups = [
//     { key: "deptName", paramName: "deptId" },
//     { key: "teamName", paramName: "teamId" },
//     { key: "role", paramName: "role" },
//     { key: "jobLevelName", paramName: "jobLevel" },
//     { key: "contractTypeName", paramName: "contractTypeId" },
//     { key: "remoteWorker", paramName: "remoteWorker" },
//     { key: "siteName", paramName: "siteId" },
//   ];

//   const keyToIdMapping: Record<string, string> = {
//     deptName: "deptId",
//     teamName: "teamId",
//     jobLevelName: "jobLevelId",
//     contractTypeName: "contractTypeId",
//     siteName: "siteId",
//   };

//   const availableOptions: FilterOptionGroup[] = [];

//   const buildEndpoint = (filters: any) => {
//     let endpoint = `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;
//     Object.keys(filters).forEach((key) => {
//       if (filters[key]?.length) {
//         endpoint += `&${key}=${filters[key].join(",")}`;
//       }
//     });
//     return endpoint;
//   };

//   for (const group of filterGroups) {
//     const filtersExcludingCurrentGroup = { ...selectedFilters } as Record<
//       string,
//       string[]
//     >;
//     delete filtersExcludingCurrentGroup[group.paramName];

//     const endpoint = buildEndpoint(filtersExcludingCurrentGroup);

//     try {
//       const response = await apiClient(endpoint, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${apiToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch data for ${group.key}`);
//       }

//       const dataForGroup: ApiResponse = await response.json();

//       const options = dataForGroup.resource
//         .map((item) => {
//           const label = item[group.key as keyof ApiResponseItem];
//           const idKey = keyToIdMapping[group.key];
//           const value = idKey ? item[idKey as keyof ApiResponseItem] : label;

//           return { label: String(label), value: String(value) };
//         })
//         .filter((option) => option.label && option.label !== "null");

//       const uniqueOptions = Array.from(
//         new Map(options.map((item) => [item.value, item])).values()
//       );

//       availableOptions.push({
//         label: camelCaseToWords(group.key),
//         options: uniqueOptions,
//       });
//     } catch (error) {
//       console.error("Error fetching data for group:", group.key, error);
//     }
//   }

//   const endpointWithAllFilters = buildEndpoint(selectedFilters);

//   let finalData: ApiResponse = { resource: [] };

//   try {
//     const response = await apiClient(endpointWithAllFilters, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${apiToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch final data");
//     }

//     finalData = await response.json();
//   } catch (error) {
//     console.error("Error fetching final data:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch data from the API." },
//       { status: 500 }
//     );
//   }

//   const weekGroups = new Map<
//     string,
//     { score: number; item: ApiResponseItem }[]
//   >();

//   for (const item of finalData.resource) {
//     const respFull = JSON.parse(item.jsonBpRespFull);
//     const happinessScore = parseFloat(respFull.happinessScore);

//     const createdAt = new Date(item.createdAt);

//     const [year, weekNo] = getWeekNumber(createdAt);
//     const weekKey = `${year}-W${weekNo}`;

//     if (!weekGroups.has(weekKey)) {
//       weekGroups.set(weekKey, []);
//     }
//     weekGroups.get(weekKey)?.push({ score: happinessScore, item });
//   }

//   const dataPointsArray: DataPoint[] = [];
//   let previousWeekAverage = null;
//   let currentWeekAverage = null;
//   let mostRecentWeek = null;

//   for (const [weekKey, entries] of Array.from(weekGroups.entries())) {
//     const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
//     const avgScore = totalScore / entries.length;

//     dataPointsArray.push({
//       title: weekKey,
//       value: avgScore,
//     });

//     if (!currentWeekAverage || weekKey > currentWeekAverage.title) {
//       previousWeekAverage = currentWeekAverage;
//       currentWeekAverage = { title: weekKey, value: avgScore };
//       mostRecentWeek = weekKey;
//     }
//   }

//   dataPointsArray.sort((a, b) => {
//     const parseWeekKey = (key: string): [number, number] => {
//       const [yearPart, weekPart] = key.split("-W");
//       return [parseInt(yearPart, 10), parseInt(weekPart, 10)];
//     };
//     const [yearA, weekA] = parseWeekKey(a.title);
//     const [yearB, weekB] = parseWeekKey(b.title);

//     return yearA !== yearB ? yearA - yearB : weekA - weekB;
//   });

//   const speechBubbleData: SpeechBubbleData = {
//     currentScore: currentWeekAverage?.value || 0,
//     change:
//       currentWeekAverage && previousWeekAverage
//         ? currentWeekAverage.value - previousWeekAverage.value
//         : 0,
//     positiveChange:
//       currentWeekAverage && previousWeekAverage
//         ? currentWeekAverage.value >= previousWeekAverage.value
//         : true,
//   };

//   const masonryCounts = [0, 0, 0, 0, 0];
//   const peopleList: {
//     firstName: string;
//     lastName: string;
//     jobTitle: string;
//     department: string;
//   }[] = [];

//   if (mostRecentWeek) {
//     const recentWeekEntries = weekGroups.get(mostRecentWeek) || [];
//     recentWeekEntries.forEach(({ score, item }) => {
//       if (score >= 9) masonryCounts[3]++;
//       else if (score >= 6) masonryCounts[2]++;
//       else if (score >= 3) masonryCounts[1]++;
//       else if (score > 0) masonryCounts[0]++;
//       else masonryCounts[4]++;

//       peopleList.push({
//         firstName: item.firstName,
//         lastName: item.lastName,
//         jobTitle: item.jobLevelName,
//         department: item.deptName,
//       });
//     });
//   }

//   return NextResponse.json({
//     filterOptions: availableOptions,
//     lineGraphData: dataPointsArray,
//     speechBubbleData,
//     masonryData: masonryCounts,
//     peopleData: peopleList,
//     data: finalData.resource,
//   });
// }

// api/happiness-graphs/getManagerDashboardData.ts

import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";
import {
  FilterOption,
  FilterOptionGroup,
} from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/page";

interface ApiResponse {
  resource: ApiResponseItem[];
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

export async function GET(request: Request) {
  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;

  // Parse query parameters sent from the client
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const selectedFilters = {
    siteId: queryParams.siteId?.split(",") || [],
    jobLevel: queryParams.jobLevel?.split(",") || [],
    deptId: queryParams.deptId?.split(",") || [],
    teamId: queryParams.teamId?.split(",") || [],
    contractTypeId: queryParams.contractTypeId?.split(",") || [],
    role: queryParams.role?.split(",") || [],
    remoteWorker: queryParams.remoteWorker === "true" ? ["true"] : [],
  };

  const workflowId = queryParams.workflowId || 1;
  const businessProcessId = queryParams.businessProcessId || 1;
  const toolConfigId = queryParams.toolConfigId || 1;

  // Define filter groups
  const filterGroups = [
    { key: "deptName", paramName: "deptId" },
    { key: "teamName", paramName: "teamId" },
    { key: "role", paramName: "role" },
    { key: "jobLevelName", paramName: "jobLevel" },
    { key: "contractTypeName", paramName: "contractTypeId" },
    { key: "remoteWorker", paramName: "remoteWorker" },
    { key: "siteName", paramName: "siteId" },
  ];

  const keyToIdMapping: Record<string, string> = {
    deptName: "deptId",
    teamName: "teamId",
    jobLevelName: "jobLevelId",
    contractTypeName: "contractTypeId",
    siteName: "siteId",
  };

  const availableOptions: FilterOptionGroup[] = [];

  const buildEndpoint = (filters: any) => {
    let endpoint = `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;
    Object.keys(filters).forEach((key) => {
      if (filters[key]?.length) {
        endpoint += `&${key}=${filters[key].join(",")}`;
      }
    });
    return endpoint;
  };

  for (const group of filterGroups) {
    const filtersExcludingCurrentGroup = { ...selectedFilters } as Record<
      string,
      string[]
    >;
    delete filtersExcludingCurrentGroup[group.paramName];

    const endpoint = buildEndpoint(filtersExcludingCurrentGroup);

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

      const options = dataForGroup.resource
        .map((item) => {
          const label = item[group.key as keyof ApiResponseItem];
          const idKey = keyToIdMapping[group.key];
          const value = idKey ? item[idKey as keyof ApiResponseItem] : label;

          return { label: String(label), value: String(value) };
        })
        .filter((option) => option.label && option.label !== "null");

      const uniqueOptions = Array.from(
        new Map(options.map((item) => [item.value, item])).values(),
      );

      availableOptions.push({
        label: camelCaseToWords(group.key),
        options: uniqueOptions,
      });
    } catch (error) {
      console.error("Error fetching data for group:", group.key, error);
    }
  }

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
      { status: 500 },
    );
  }

  const weekGroups = new Map<
    string,
    { score: number; item: ApiResponseItem }[]
  >();

  // Initialize maps for departments and sites
  const departmentScores = new Map<
    string,
    { totalScore: number; count: number }
  >();
  const siteScores = new Map<string, { totalScore: number; count: number }>();

  for (const item of finalData.resource) {
    const respFull = JSON.parse(item.jsonBpRespFull);
    const happinessScore = parseFloat(respFull.happinessScore);

    // Group data by weeks
    const createdAt = new Date(item.createdAt);
    const [year, weekNo] = getWeekNumber(createdAt);
    const weekKey = `${year}-W${weekNo}`;

    if (!weekGroups.has(weekKey)) {
      weekGroups.set(weekKey, []);
    }
    weekGroups.get(weekKey)?.push({ score: happinessScore, item });

    // Compute department scores
    const deptName = item.deptName;
    if (deptName) {
      if (!departmentScores.has(deptName)) {
        departmentScores.set(deptName, { totalScore: 0, count: 0 });
      }
      const deptData = departmentScores.get(deptName)!;
      deptData.totalScore += happinessScore;
      deptData.count += 1;
    }

    // Compute site scores
    const siteName = item.siteName;
    if (siteName) {
      if (!siteScores.has(siteName)) {
        siteScores.set(siteName, { totalScore: 0, count: 0 });
      }
      const siteData = siteScores.get(siteName)!;
      siteData.totalScore += happinessScore;
      siteData.count += 1;
    }
  }

  const dataPointsArray: DataPoint[] = [];
  let previousWeekAverage = null;
  let currentWeekAverage = null;
  let mostRecentWeek = null;

  for (const [weekKey, entries] of Array.from(weekGroups.entries())) {
    const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
    const avgScore = totalScore / entries.length;

    dataPointsArray.push({
      title: weekKey,
      value: avgScore,
    });

    if (!currentWeekAverage || weekKey > currentWeekAverage.title) {
      previousWeekAverage = currentWeekAverage;
      currentWeekAverage = { title: weekKey, value: avgScore };
      mostRecentWeek = weekKey;
    }
  }

  dataPointsArray.sort((a, b) => {
    const parseWeekKey = (key: string): [number, number] => {
      const [yearPart, weekPart] = key.split("-W");
      return [parseInt(yearPart, 10), parseInt(weekPart, 10)];
    };
    const [yearA, weekA] = parseWeekKey(a.title);
    const [yearB, weekB] = parseWeekKey(b.title);

    return yearA !== yearB ? yearA - yearB : weekA - weekB;
  });

  const speechBubbleData: SpeechBubbleData = {
    currentScore: currentWeekAverage?.value || 0,
    change:
      currentWeekAverage && previousWeekAverage
        ? currentWeekAverage.value - previousWeekAverage.value
        : 0,
    positiveChange:
      currentWeekAverage && previousWeekAverage
        ? currentWeekAverage.value >= previousWeekAverage.value
        : true,
  };

  const masonryCounts = [0, 0, 0, 0, 0];
  const peopleList: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    department: string;
  }[] = [];

  if (mostRecentWeek) {
    const recentWeekEntries = weekGroups.get(mostRecentWeek) || [];
    recentWeekEntries.forEach(({ score, item }) => {
      if (score >= 9) masonryCounts[3]++;
      else if (score >= 6) masonryCounts[2]++;
      else if (score >= 3) masonryCounts[1]++;
      else if (score > 0) masonryCounts[0]++;
      else masonryCounts[4]++;

      peopleList.push({
        firstName: item.firstName,
        lastName: item.lastName,
        jobTitle: item.jobLevelName,
        department: item.deptName,
      });
    });
  }

  // Compute average scores per department
  const departmentsData: { department: string; averageScore: number }[] = [];

  departmentScores.forEach((value, key) => {
    departmentsData.push({
      department: key,
      averageScore: value.totalScore / value.count,
    });
  });

  // Compute average scores per site
  const sitesData: { site: string; averageScore: number }[] = [];

  siteScores.forEach((value, key) => {
    sitesData.push({
      site: key,
      averageScore: value.totalScore / value.count,
    });
  });

  return NextResponse.json({
    filterOptions: availableOptions,
    lineGraphData: dataPointsArray,
    speechBubbleData,
    masonryData: masonryCounts,
    peopleData: peopleList,
    departmentsData,
    sitesData,
    data: finalData.resource,
  });
}
