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

function camelCaseToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
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
    let endpoint = `/getAllView?view=vwHappinessScoreCurrentWeek&toolConfigId=${toolConfigId}&workflowId=${workflowId}&businessProcessId=${businessProcessId}`;
    Object.keys(filters).forEach((key) => {
      if (filters[key]?.length) {
        endpoint += `&${key}=${filters[key].join(",")}`;
      }
    });

    console.log(endpoint);

    return endpoint;
  };

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
    (result) => result !== null,
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
      { status: 500 },
    );
  }

  return NextResponse.json({
    filterOptions: availableOptions,
    data: finalData.resource,
  });
}
