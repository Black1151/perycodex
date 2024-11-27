"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  score: number;
}

export default function ManagerDashboardPage() {
  const [drawerState, setDrawerState] = useState<"closed" | "fully-open">(
    "closed"
  );

  const isInitialMount = useRef(true);
  const [loading, setLoading] = useState(true);
  const [masonryData, setMasonryData] = useState<number[]>([]);
  const [lineGraphData, setLineGraphData] = useState<DataPoint[]>([]);
  const [speechBubbleData, setSpeechBubbleData] =
    useState<SpeechBubbleData | null>(null);
  const [peopleListData, setPeopleListData] = useState<Person[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionGroup[]>([]);
  const [departmentsData, setDepartmentsData] = useState<
    { department: string; averageScore: number }[]
  >([]);
  const [sitesData, setSitesData] = useState<
    { site: string; averageScore: number }[]
  >([]);
  const [weeksData, setWeeksData] = useState<any[]>([]);
  const [weekOptions, setWeekOptions] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all");
  const [staffHappinessDetailsModalData, setStaffHappinessDetailsModalData] =
    useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize time range options
  const timeRangeOptions = useMemo(
    () => ["1 month", "3 months", "6 months", "1 year", "all"],
    []
  );

  // Memoize labelToParamName
  const labelToParamName: Record<string, string> = useMemo(
    () => ({
      "Dept Name": "deptId",
      "Team Name": "teamId",
      Role: "role",
      "Job Level Name": "jobLevel",
      "Contract Type Name": "contractTypeId",
      "Remote Worker": "remoteWorker",
      "Site Name": "siteId",
    }),
    []
  );

  const constructQueryParams = useCallback(
    (filters: FilterOptionGroup[], timeRange: string): string => {
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

      if (timeRange && timeRange !== "all") {
        params.append("timeRange", timeRange);
      }

      return params.toString();
    },
    [labelToParamName]
  );

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

  const fetchFilteredData = useCallback(
    async (
      currentFilters: FilterOptionGroup[],
      timeRange: string = selectedTimeRange
    ) => {
      const queryParams = constructQueryParams(currentFilters, timeRange);
      const response = await fetch(
        `/api/happiness-graphs/getManagerDashboardData?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      updateFilterOptions(data.filterOptions, currentFilters);

      setLineGraphData(data.lineGraphData);
      setWeeksData(data.weeksData);

      const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
      setWeekOptions(weekTitles);
      setSelectedWeek(weekTitles[weekTitles.length - 1]);
    },
    [constructQueryParams, updateFilterOptions, selectedTimeRange]
  );

  const clearAllFilters = useCallback(() => {
    const clearedFilters = filterOptions.map((group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        isSelected: false,
      })),
    }));
    setFilterOptions(clearedFilters);
    fetchFilteredData(clearedFilters, selectedTimeRange);
  }, [filterOptions, fetchFilteredData, selectedTimeRange]);

  const handleCheckboxChange = useCallback(
    (groupIndex: number, optionIndex: number, isChecked: boolean) => {
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
      fetchFilteredData(updatedFilters, selectedTimeRange);
    },
    [filterOptions, fetchFilteredData, selectedTimeRange]
  );

  const handleWeekChange = useCallback((week: string) => {
    setSelectedWeek(week);
  }, []);

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
      console.log("data", data);
      setStaffHappinessDetailsModalData(data.resource);
      setIsModalOpen(true);
    },
    []
  );

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const queryParams = constructQueryParams([], selectedTimeRange);
        const response = await fetch(
          `/api/happiness-graphs/getManagerDashboardData?${queryParams}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

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
        setLineGraphData(data.lineGraphData);
        setWeeksData(data.weeksData);

        const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
        setWeekOptions(weekTitles);
        setSelectedWeek(weekTitles[weekTitles.length - 1]);

        isInitialMount.current = false;
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [constructQueryParams, selectedTimeRange]);

  // Update state when selectedWeek changes
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
    }),
    [
      handleCheckboxChange,
      filterOptions,
      weekOptions,
      selectedWeek,
      handleWeekChange,
      drawerState,
      setDrawerState,
    ]
  );

  return (
    <>
      <DashboardFilteringDrawer {...dashboardFilteringDrawerProps} />
      <ManagerDashboardPageInner
        loading={loading}
        speechBubbleData={speechBubbleData}
        lineGraphData={lineGraphData}
        masonryData={masonryData}
        peopleListData={peopleListData}
        departmentsData={departmentsData}
        sitesData={sitesData}
        selectedTimeRange={selectedTimeRange}
        fetchHappinessScoreTwoMonthHistory={fetchHappinessScoreTwoMonthHistory}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        staffHappinessDetailsModalData={staffHappinessDetailsModalData}
        setDrawerState={setDrawerState}
        drawerState={drawerState}
      />
    </>
  );
}
