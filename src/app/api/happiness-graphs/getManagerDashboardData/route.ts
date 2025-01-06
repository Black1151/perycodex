import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/company-dashboard/ManagerDashboard";

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
  jobTitle: string;
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
  score: number | null;
}

// Helper function to convert camelCase keys to a more human-readable format
function camelCaseToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

// Given a date, returns a tuple [year, weekNumber]
const getWeekNumber = (date: Date): [number, number] => {
  const target = new Date(date.valueOf());
  // Convert Sunday=0, Monday=1, etc., to Monday=0-based
  const dayNr = (date.getDay() + 6) % 7;
  // Set date to Thursday of the current week to ensure correct ISO week number
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  // Find the first Thursday of the year
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  // Calculate week number
  const weekNo = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return [target.getFullYear(), weekNo];
};

interface WeekData {
  weekKey: string;
  startDate: Date;
  endDate: Date;
}

// Generates a list of WeekData objects representing all weeks between two dates
function getAllWeekKeysBetween(startDate: Date, endDate: Date): WeekData[] {
  const weeks: WeekData[] = [];
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  // Align currentDate to the nearest Monday (start of the week)
  currentDate.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));

  // Loop until we pass the endDate, building week ranges (Mon-Sun)
  while (currentDate <= endDate) {
    const [year, weekNo] = getWeekNumber(currentDate);
    const weekKey = `${year}-W${weekNo}`;

    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    // End of week is Sunday: Monday + 6 days
    weekEnd.setDate(weekEnd.getDate() + 6);

    weeks.push({
      weekKey: weekKey,
      startDate: weekStart,
      endDate: weekEnd,
    });

    // Move to the next week
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weeks;
}

interface DidNotParticipateParams {
  workflowId: number;
  businessProcessId: number;
  toolConfigId: number;
  startDate: string;
  endDate: string;
}

// Fetch data about users who did not participate in the survey for a given timeframe
async function getDidNotParticipate({
  workflowId,
  businessProcessId,
  toolConfigId,
  startDate,
  endDate,
}: DidNotParticipateParams) {
  const response = await apiClient("/getUserHappinessParticipants", {
    method: "POST",
    body: JSON.stringify({
      scheduleId: 14,
      customerId: 1,
      toolConfigId,
      workflowId,
      businessProcessId,
      startDate,
      endDate,
    }),
  });

  return response.json();
}

export async function GET(request: Request) {
  // Extract the token and query params
  const cookieStore = cookies();
  const apiToken = cookieStore.get("auth_token")?.value;
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  const preFilter = queryParams.preFilter;

  // Arrays to store IDs of departments/teams that the user manages (if necessary)
  let managerOfDeptIds: string[] = [];
  let managerOfTeamIds: string[] = [];

  // If the user wants to filter by only the departments or teams they manage,
  // we need to fetch that information first.
  if (preFilter === "departments" || preFilter === "teams") {
    try {
      const uniqueId = cookieStore.get("user_uuid")?.value;
      if (!uniqueId) {
        return NextResponse.json(
          { error: "User unique ID not found in cookies." },
          { status: 400 }
        );
      }

      // Fetch which departments/teams the user manages
      const response = await apiClient("/getTeamsUserIsManagerOf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ userUniqueId: uniqueId }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch manager of departments and teams: ${response.statusText}`
        );
      }

      const data = await response.json();
      const deptIds = data.resource.managerOfDeptIds || [];
      const teamIds = data.resource.managerOfTeamIds || [];

      // Convert to strings for consistency
      managerOfDeptIds = deptIds.map(String);
      managerOfTeamIds = teamIds.map(String);
    } catch (error) {
      console.error("Error fetching manager of departments and teams:", error);
      return NextResponse.json(
        { error: "Failed to fetch manager of departments and teams." },
        { status: 500 }
      );
    }

    // If we have a preFilter on departments but the user manages no departments, return 403
    if (preFilter === "departments") {
      if (managerOfDeptIds.length === 0) {
        return NextResponse.json(
          { error: "User does not manage any departments." },
          { status: 403 }
        );
      }
    }

    // If we have a preFilter on teams but the user manages no teams, return 403
    else if (preFilter === "teams") {
      if (managerOfTeamIds.length === 0) {
        return NextResponse.json(
          { error: "User does not manage any teams." },
          { status: 403 }
        );
      }
    }
  }

  // Determine the chosen time range, defaulting to 'all'
  const timeRange = queryParams.timeRange || "all";

  // Convert query parameters into arrays for filtering
  const selectedFilters = {
    siteId: queryParams.siteId?.split(",") || [],
    jobLevelId: queryParams.jobLevelId?.split(",") || [],
    deptId: queryParams.deptId?.split(",") || [],
    teamId: queryParams.teamId?.split(",") || [],
    contractTypeId: queryParams.contractTypeId?.split(",") || [],
    role: queryParams.role?.split(",") || [],
    remoteWorker: queryParams.remoteWorker === "true" ? ["true"] : [],
    userTagId: queryParams.userTagId?.split(",") || [],
    siteTagId: queryParams.siteTagId?.split(",") || [],
    customerTagId: queryParams.customerTagId?.split(",") || [],
  };

  // Extract workflow, business process, and tool config IDs from query or set defaults
  const workflowId = queryParams.workflowId || 1;
  const businessProcessId = queryParams.businessProcessId || 1;
  const toolConfigId = queryParams.toolConfigId || 1;

  // Define all possible filter groups (categories of data) for dynamic option generation
  const filterGroups = [
    { key: "deptName", paramName: "deptId" },
    { key: "teamName", paramName: "teamId" },
    { key: "role", paramName: "role" },
    { key: "jobLevelName", paramName: "jobLevelId" },
    { key: "contractTypeName", paramName: "contractTypeId" },
    { key: "remoteWorker", paramName: "remoteWorker" },
    { key: "siteName", paramName: "siteId" },
    { key: "userTags", paramName: "userTagId" },
    { key: "siteTags", paramName: "siteTagId" },
    { key: "customerTags", paramName: "customerTagId" },
  ];

  // Mapping from a display key to an ID field in the returned data
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

  // Builds the API endpoint with query parameters based on filters and pre-filter restrictions
  function buildEndpoint(
    filters: any,
    managerOfDeptIds: string[],
    managerOfTeamIds: string[],
    preFilter: string | undefined
  ) {
    let endpoint = `/getAllView?view=vwDashboardDataFromReportJson&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;

    // If we have a department preFilter, ensure deptId only includes managed departments
    if (preFilter === "departments") {
      if (managerOfDeptIds.length > 0) {
        if (filters.deptId && filters.deptId.length > 0) {
          // Filter down to only those deptIds the user manages
          filters.deptId = filters.deptId.filter((id: string) =>
            managerOfDeptIds.includes(id)
          );
          if (filters.deptId.length === 0) {
            // If no valid departments remain, return an empty endpoint string
            return "";
          }
        } else {
          // No deptId selected, so default to all managed departments
          filters.deptId = managerOfDeptIds;
        }
      } else {
        // No managed departments, can't proceed
        return "";
      }
    }

    // Similarly, if we have a teams preFilter
    else if (preFilter === "teams") {
      if (managerOfTeamIds.length > 0) {
        if (filters.teamId && filters.teamId.length > 0) {
          filters.teamId = filters.teamId.filter((id: string) =>
            managerOfTeamIds.includes(id)
          );
          if (filters.teamId.length === 0) {
            return "";
          }
        } else {
          filters.teamId = managerOfTeamIds;
        }
      } else {
        // No managed teams
        return "";
      }
    }

    // Append each filter as a query parameter
    Object.keys(filters).forEach((key) => {
      if (filters[key]?.length) {
        endpoint += `&${key}=${filters[key].join(",")}`;
      }
    });

    return endpoint;
  }

  // Convert the chosen time range into a startDate for filtering data
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

  // For each filter group, we fetch data excluding that group's parameter
  // This helps us build a list of available options for that group
  const filterGroupPromises = filterGroups.map(async (group) => {
    // Make a copy of the selected filters
    const filtersExcludingCurrentGroup = { ...selectedFilters } as Record<
      string,
      string[]
    >;
    // Remove the current group's filter from the request
    delete filtersExcludingCurrentGroup[group.paramName];

    // Build endpoint without the current group's filter applied
    const endpoint = buildEndpoint(
      filtersExcludingCurrentGroup,
      managerOfDeptIds,
      managerOfTeamIds,
      preFilter
    );

    // If no endpoint (means no data or invalid), return null
    if (!endpoint) {
      return null;
    }

    try {
      // Fetch data to determine available options for this filter group
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
      const optionsSet = new Map<string, { label: string; value: string }>();

      // Iterate over each item to extract unique filter options
      for (const item of dataForGroup.resource) {
        let dataField = item[group.key as keyof ApiResponseItem];

        // If we are dealing with tag fields (e.g. userTags), they might be JSON arrays
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

          // Extract unique tags and their IDs
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
          // For non-tag fields, we rely on a direct label and ID mapping
          const label = dataField;
          const idKey = keyToIdMapping[group.key];
          // The value is the ID field (e.g. deptId) or the label itself if no ID field
          const value = idKey ? item[idKey as keyof ApiResponseItem] : label;
          if (label && label !== "null") {
            optionsSet.set(String(value), {
              label: String(label),
              value: String(value),
            });
          }
        }
      }

      // Sort options alphabetically by label
      const options = Array.from(optionsSet.values());
      options.sort((a, b) => a.label.localeCompare(b.label));

      // Custom labels for tag groups
      const groupLabels: Record<string, string> = {
        userTags: "User Tags",
        siteTags: "Site Tags",
        customerTags: "Customer Tags",
      };

      return {
        label: groupLabels[group.key] || camelCaseToWords(group.key),
        options: options,
      };
    } catch (error) {
      console.error("Error fetching data for group:", group.key, error);
      return null;
    }
  });

  // Resolve all filter group promises to get our filter options
  const filterGroupResults = await Promise.all(filterGroupPromises);

  // Filter out any null results
  const availableOptions = filterGroupResults.filter(
    (result) => result !== null
  ) as FilterOptionGroup[];

  // Now build the endpoint with all filters actually applied
  const endpointWithAllFilters = buildEndpoint(
    selectedFilters,
    managerOfDeptIds,
    managerOfTeamIds,
    preFilter
  );

  if (!endpointWithAllFilters) {
    return NextResponse.json(
      { error: "No data available based on your filters." },
      { status: 403 }
    );
  }

  // Fetch the final main dataset based on all filters
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

  // Group the data by week (for line chart, speech bubble, etc.)
  const weekGroups = new Map<
    string,
    { score: number; item: ApiResponseItem }[]
  >();

  let earliestDate: Date | null = startDate || null;

  // Process each item in the final data
  for (const item of finalData.resource) {
    // Parse the full response field to get the happiness score
    const respFull = JSON.parse(item.jsonBpRespFull);
    const happinessScore = parseFloat(respFull.happinessScore);

    const createdAt = new Date(item.createdAt);

    // Skip items before the startDate if a startDate is defined
    if (startDate && createdAt < startDate) {
      continue;
    }

    // Track the earliest date encountered in the filtered results
    if (!earliestDate || createdAt < earliestDate) {
      earliestDate = createdAt;
    }

    // Calculate the week key (year-weekNumber)
    const [year, weekNo] = getWeekNumber(createdAt);
    const weekKey = `${year}-W${weekNo}`;

    // Group entries by their week
    if (!weekGroups.has(weekKey)) {
      weekGroups.set(weekKey, []);
    }
    weekGroups.get(weekKey)?.push({ score: happinessScore, item });
  }

  // If we never found any data date, use the startDate or now
  if (!earliestDate) {
    earliestDate = startDate || new Date();
  }

  // We'll build line chart data and weekly breakdowns over the range from earliestDate to now
  const currentDate = new Date();
  const allWeekData = getAllWeekKeysBetween(earliestDate, currentDate);

  const dataPointsArray: DataPoint[] = [];
  const weeksData: any[] = [];

  function formatDate(d: Date) {
    return d.toISOString().split("T")[0];
  }

  // Process each week to calculate averages, category counts, and participant details
  for (const {
    weekKey,
    startDate: weekStart,
    endDate: weekEnd,
  } of allWeekData) {
    const entries = weekGroups.get(weekKey) || [];

    // Initialize average score and category counts
    let avgScore = 0;
    const masonryCounts = [0, 0, 0, 0, 0]; // [1-2, 3-5, 6-8, 9-10, non-participants]
    const peopleList: Person[] = [];

    // Maps to aggregate scores by department and site
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

    // Calculate average score and categorize participants
    if (entries.length > 0) {
      const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
      avgScore = totalScore / entries.length;

      // Classify each participant and accumulate department/site data
      entries.forEach(({ score, item }) => {
        // Classify the happiness score into buckets
        if (score >= 9)
          masonryCounts[3]++; // Scores 9-10
        else if (score >= 6)
          masonryCounts[2]++; // Scores 6-8
        else if (score >= 3)
          masonryCounts[1]++; // Scores 3-5
        else if (score > 0) masonryCounts[0]++; // Scores 1-2

        // Add the person to the peopleList
        peopleList.push({
          userId: item.userId,
          imageUrl: item.userImageUrl,
          fullName: item.fullName,
          firstName: item.firstName,
          lastName: item.lastName,
          jobTitle: item.jobTitle,
          department: item.deptName,
          site: item.siteName,
          score: score,
        });

        // Department aggregation
        const deptName = item.deptName;
        if (deptName) {
          if (!departmentScores.has(deptName)) {
            departmentScores.set(deptName, { totalScore: 0, count: 0 });
          }
          const deptData = departmentScores.get(deptName)!;
          deptData.totalScore += score;
          deptData.count += 1;
        }

        // Site aggregation
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
          // Update site name if this entry is more recent
          const itemCreatedAt = new Date(item.createdAt);
          if (itemCreatedAt > siteData.mostRecentCreatedAt) {
            siteData.mostRecentCreatedAt = itemCreatedAt;
            siteData.mostRecentSiteName = item.siteName;
          }
        }
      });
    }

    // Fetch non-participants for this week, based on the workflow and toolConfig IDs
    const didNotParticipateData = await getDidNotParticipate({
      workflowId: Number(workflowId),
      businessProcessId: Number(businessProcessId),
      toolConfigId: Number(toolConfigId),
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
    });

    // If we have a preFilter on departments or teams, filter non-participants accordingly
    const filteredNonParticipantData =
      didNotParticipateData?.resource?.filter((item: any) => {
        if (preFilter === "departments") {
          return managerOfDeptIds.includes(String(item.departmentId));
        }
        if (preFilter === "teams") {
          return managerOfTeamIds.includes(String(item.teamId));
        }
        return true; // If no preFilter or doesn't match, include all
      }) || [];

    // The last index of masonryCounts represents non-participants
    masonryCounts[4] = filteredNonParticipantData.length || 0;

    // Add non-participants to the people list
    let nonParticipants = filteredNonParticipantData.map((np: any) => ({
      userId: np.UserId,
      imageUrl: np.imageUrl,
      fullName: np.fullName,
      firstName: np.fullName.split(" ")[0] || "",
      lastName: np.fullName.split(" ").slice(1).join(" ") || "",
      jobTitle: np.jobTitle,
      department: np.deptName,
      site: np.siteName,
      score: null, // no score
    }));
    peopleList.push(...nonParticipants);

    // Compute department data array
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

    // Compute site data array
    const sitesData: {
      site: string;
      averageScore: number;
      count: number;
    }[] = [];
    siteScores.forEach((value, key) => {
      sitesData.push({
        site: value.mostRecentSiteName,
        averageScore: value.totalScore / value.count,
        count: value.count,
      });
    });

    // Add this week's average to the line graph data
    dataPointsArray.push({
      title: weekKey,
      value: avgScore,
    });

    // Collect all weekly details for the response
    weeksData.push({
      weekKey,
      avgScore,
      masonryCounts,
      peopleList,
      departmentsData,
      sitesData,
    });
  }

  // Compute speech bubble data (current score and difference from previous week)
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
    // Only one data point means we have no previous reference
    speechBubbleData = {
      currentScore: dataPointsArray[0].value,
      change: 0,
      positiveChange: true,
    };
  }

  // Return all computed data as JSON
  return NextResponse.json({
    filterOptions: availableOptions,
    lineGraphData: dataPointsArray,
    speechBubbleData,
    weeksData,
    data: finalData.resource,
  });
}
