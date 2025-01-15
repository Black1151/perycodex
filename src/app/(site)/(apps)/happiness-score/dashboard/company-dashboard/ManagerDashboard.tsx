"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ManagerDashboardPageInner from "./ManagerDashboardPageInner";
import { DashboardFilteringDrawer } from "@/components/layout/DashboardFilteringDrawer";

interface DataPoint {
  value: number;
  title: string;
}

export interface FilterOption {
  label: string;
  value: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface FilterOptionGroup {
  label: string;
  options: FilterOption[];
}

export interface SpeechBubbleData {
  currentScore: number;
  change: number;
  positiveChange: boolean;
}

export interface Person {
  userId: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  site: string;
  score: number;
  imageUrl: string;
  fullName: string;
}

interface ManagerDashboardPageProps {
  preFilter?: "teams" | "departments";
}

export default function ManagerDashboardPage({
  preFilter,
}: ManagerDashboardPageProps) {
  const [drawerState, setDrawerState] = useState<"closed" | "fully-open">(
    "closed"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [masonryData, setMasonryData] = useState<number[]>([]);
  const [lineGraphData, setLineGraphData] = useState<DataPoint[]>([]);
  const [speechBubbleData, setSpeechBubbleData] =
    useState<SpeechBubbleData | null>(null);
  const [peopleListData, setPeopleListData] = useState<Person[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionGroup[]>([]);
  const [departmentsData, setDepartmentsData] = useState<
    { department: string; averageScore: number; count: number }[]
  >([]);
  const [sitesData, setSitesData] = useState<
    { site: string; averageScore: number; count: number }[]
  >([]);
  const [weeksData, setWeeksData] = useState<any[]>([]);
  const [weekOptions, setWeekOptions] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const [staffHappinessDetailsModalData, setStaffHappinessDetailsModalData] =
    useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [AgGridTableData, setAgGridTableData] = useState<Person[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0); // Holds the last known scroll position

  const saveScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      scrollPosition.current = scrollRef.current.scrollTop;
    }
  }, []);

  /**
   * Map UI labels to the query parameter names your backend expects.
   * Make sure these labels match what's returned in your FilterOptionGroup.
   */
  const labelToParamName: Record<string, string> = useMemo(
    () => ({
      "Dept Name": "deptId",
      "Team Name": "teamId",
      Role: "role",
      "Job Level Name": "jobLevelId",
      "Contract Type Name": "contractTypeId",
      "Remote Worker": "remoteWorker",
      "Site Name": "siteId",
      "User Tags": "userTagId",
      "Site Tags": "siteTagId",
      "Customer Tags": "customerTagId",
    }),
    []
  );

  /**
   * Build a query string based on the user’s filter selections.
   * We no longer append `timeRange` because we removed that feature.
   */
  const constructQueryParams = useCallback(
    (filters: FilterOptionGroup[]): string => {
      const params = new URLSearchParams();

      filters.forEach((group) => {
        const selectedOptions = group.options.filter(
          (option) => option.isSelected
        );
        if (selectedOptions.length > 0) {
          const paramName = labelToParamName[group.label];
          if (paramName) {
            const paramValues = selectedOptions
              .map((option) => option.value)
              .join(",");
            params.append(paramName, paramValues);
          }
        }
      });

      // If we have a preFilter (teams or departments), pass it along
      if (preFilter) {
        params.append("preFilter", preFilter);
      }

      return params.toString();
    },
    [labelToParamName, preFilter]
  );

  /**
   * Update filter options in the UI after we fetch new filter data from the server.
   * This logic ensures that any newly fetched "valid" filters remain enabled, while
   * options that the server no longer includes become disabled.
   */
  const updateFilterOptions = useCallback(
    (newFilters: FilterOptionGroup[], currentFilters: FilterOptionGroup[]) => {
      const updatedFilters = currentFilters.map((group) => {
        const newGroup = newFilters.find((g) => g.label === group.label);
        if (newGroup) {
          const updatedOptions = group.options.map((option) => {
            const newOption = newGroup.options.find(
              (o) => o.value === option.value
            );
            return {
              ...option,
              isDisabled: !newOption,
            };
          });
          return {
            ...group,
            options: updatedOptions,
          };
        } else {
          // If the backend didn't return a matching group at all, disable all
          const updatedOptions = group.options.map((option) => ({
            ...option,
            isDisabled: true,
          }));
          return {
            ...group,
            options: updatedOptions,
          };
        }
      });

      setFilterOptions(updatedFilters);
    },
    []
  );

  /**
   * Fetch data from your server route based on the user's current selected filters.
   */
  const fetchFilteredData = useCallback(
    async (currentFilters: FilterOptionGroup[]) => {
      // Build the query string
      const queryParams = constructQueryParams(currentFilters);

      console.log("queryParams", queryParams);
      console.log("currentFilters", currentFilters);

      const response = await fetch(
        `/api/happiness-score/dashboards/getCompanyDashboardData?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      // Update the filter options so the UI remains consistent
      updateFilterOptions(data.filterOptions, currentFilters);

      // Update your page data
      setLineGraphData(data.lineGraphData);
      setWeeksData(data.weeksData);

      const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
      setWeekOptions(weekTitles);

      // If the current selectedWeek is still valid, keep it
      if (selectedWeek && weekTitles.includes(selectedWeek)) {
        // keep existing
      } else if (weekTitles.length > 0) {
        // auto-select the latest
        setSelectedWeek(weekTitles[weekTitles.length - 1]);
      } else {
        // no weeks at all
        setSelectedWeek(null);
      }
    },
    [constructQueryParams, updateFilterOptions, selectedWeek]
  );

  /**
   * Clear all filters (set isSelected = false), then fetch fresh data with no filters.
   */
  const clearAllFilters = useCallback(async () => {
    saveScrollPosition();

    const clearedFilters = filterOptions.map((group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        isSelected: false,
      })),
    }));

    setFilterOptions(clearedFilters);
    setIsUpdating(true);

    try {
      // Re-fetch with no filters selected
      await fetchFilteredData(clearedFilters);
    } catch (error) {
      console.error("Failed to clear filters:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [filterOptions, fetchFilteredData, saveScrollPosition]);

  /**
   * Toggle a checkbox selection for a single filter option, then refetch data.
   */
  const handleCheckboxChange = useCallback(
    async (groupIndex: number, optionIndex: number, isChecked: boolean) => {
      saveScrollPosition();

      // Create updated filters
      const updatedFilters = filterOptions.map((group, gIdx) => {
        if (gIdx === groupIndex) {
          const updatedOptions = group.options.map((option, oIdx) => {
            if (oIdx === optionIndex) {
              return { ...option, isSelected: isChecked };
            }
            return option;
          });
          return { ...group, options: updatedOptions };
        }
        return group;
      });

      setFilterOptions(updatedFilters);
      setIsUpdating(true);

      try {
        await fetchFilteredData(updatedFilters);
      } catch (error) {
        console.error("Failed to update filters:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [filterOptions, fetchFilteredData, saveScrollPosition]
  );

  /**
   * Switch which week is currently selected in the UI.
   */
  const handleWeekChange = useCallback(
    (week: string) => {
      saveScrollPosition();
      setSelectedWeek(week);
    },
    [saveScrollPosition]
  );

  /**
   * Example: fetch a user's "2-month happiness" chart data.
   */
  const fetchHappinessScoreTwoMonthHistory = useCallback(
    async (userId: number) => {
      const payload = {
        toolId: 1,
        workflowId: 1,
        businessProcessId: 1,
        userId: userId,
      };

      const response = await fetch(
        "/api/happiness-graphs/getUserHappinessDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch happiness scores.");
      }

      const data = await response.json();
      setStaffHappinessDetailsModalData(data.resource);
      setIsModalOpen(true);
    },
    []
  );

  /**
   * On mount, fetch the initial data with no filters selected.
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Build query params from empty filters
        const queryParams = constructQueryParams([]);
        const response = await fetch(
          `/api/happiness-score/dashboards/getCompanyDashboardData?${queryParams}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        // Initialize filter options: set isSelected/isDisabled = false
        const initializeFilterOptions = (
          filters: FilterOptionGroup[]
        ): FilterOptionGroup[] => {
          return filters.map((group) => ({
            ...group,
            options: group.options.map((option) => ({
              ...option,
              isSelected: false,
              isDisabled: false,
            })),
          }));
        };

        const initializedFilters = initializeFilterOptions(data.filterOptions);
        setFilterOptions(initializedFilters);

        // Update line graph and weeks data
        setLineGraphData(data.lineGraphData);
        setWeeksData(data.weeksData);

        // For your table display
        setAgGridTableData(data.data);

        // Build the list of available weeks
        const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
        setWeekOptions(weekTitles);
        if (weekTitles.length > 0) {
          setSelectedWeek(weekTitles[weekTitles.length - 1]);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();

    // Set up interval to refresh data every 30 minutes
    const intervalId = setInterval(fetchInitialData, 1800000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [constructQueryParams]);

  /**
   * When `selectedWeek` changes, update the UI to reflect that week's data.
   */
  useEffect(() => {
    if (selectedWeek && weeksData.length > 0) {
      const weekDataIndex = weeksData.findIndex(
        (wd) => wd.weekKey === selectedWeek
      );
      if (weekDataIndex !== -1) {
        const weekData = weeksData[weekDataIndex];
        let change = 0;
        let positiveChange = true;
        if (weekDataIndex > 0) {
          const previousWeekData = weeksData[weekDataIndex - 1];
          change = weekData.avgScore - previousWeekData.avgScore;
          positiveChange = change >= 0;
        }

        setSpeechBubbleData({
          currentScore: weekData.avgScore,
          change: Math.abs(change),
          positiveChange: positiveChange,
        });

        setMasonryData(weekData.masonryCounts);
        setPeopleListData(weekData.peopleList);
        setDepartmentsData(weekData.departmentsData);
        setSitesData(weekData.sitesData);
      }
    }
  }, [selectedWeek, weeksData]);

  /**
   * Restore scroll position after data updates, if we're not in the middle of an update.
   */
  useLayoutEffect(() => {
    if (!isUpdating && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition.current;
    }
  }, [isUpdating]);

  /**
   * Props for the filtering drawer component
   */
  const dashboardFilteringDrawerProps = useMemo(
    () => ({
      handleCheckboxChange,
      filterOptions,
      title: "Data Filters",
      clearAllFilters,
      weekOptions,
      selectedWeek,
      onWeekChange: handleWeekChange,
      drawerState,
      setDrawerState,
      isUpdating,
      refreshPage: clearAllFilters,
      scrollRef,
      saveScrollPosition,
    }),
    [
      handleCheckboxChange,
      filterOptions,
      weekOptions,
      selectedWeek,
      handleWeekChange,
      drawerState,
      setDrawerState,
      isUpdating,
      clearAllFilters,
      scrollRef,
      saveScrollPosition,
    ]
  );

  /**
   * Props for the main dashboard page
   */
  const managerDashboardPageInnerProps = useMemo(
    () => ({
      speechBubbleData,
      lineGraphData,
      masonryData,
      peopleListData,
      departmentsData,
      sitesData,
      loading,
      fetchHappinessScoreTwoMonthHistory,
      isModalOpen,
      setIsModalOpen,
      staffHappinessDetailsModalData,
      drawerState,
      AgGridTableData,
    }),
    [
      loading,
      speechBubbleData,
      lineGraphData,
      masonryData,
      peopleListData,
      departmentsData,
      sitesData,
      fetchHappinessScoreTwoMonthHistory,
      isModalOpen,
      setIsModalOpen,
      staffHappinessDetailsModalData,
      drawerState,
      AgGridTableData,
    ]
  );

  return (
    <>
      <DashboardFilteringDrawer {...dashboardFilteringDrawerProps} />
      <ManagerDashboardPageInner {...managerDashboardPageInnerProps} />
    </>
  );
}
