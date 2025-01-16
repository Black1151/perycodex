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
  const scrollPosition = useRef<number>(0);

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

      if (preFilter) {
        params.append("preFilter", preFilter);
      }

      return params.toString();
    },
    [labelToParamName, preFilter]
  );

  // --- HELPER HOOKS AND FUNCTIONS ---

  const saveScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      scrollPosition.current = scrollRef.current.scrollTop;
    }
  }, []);

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
    async (currentFilters: FilterOptionGroup[]) => {
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

      // Update filter options
      updateFilterOptions(data.filterOptions, currentFilters);

      // Update relevant state
      setLineGraphData(data.lineGraphData);
      setWeeksData(data.weeksData);

      // Prepare new week options
      const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
      setWeekOptions(weekTitles);

      // Keep or reset selectedWeek
      if (selectedWeek && weekTitles.includes(selectedWeek)) {
        // do nothing, keep it
      } else if (weekTitles.length > 0) {
        setSelectedWeek(weekTitles[weekTitles.length - 1]);
      } else {
        setSelectedWeek(null);
      }
    },
    [constructQueryParams, updateFilterOptions, selectedWeek]
  );

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
      await fetchFilteredData(clearedFilters);
    } catch (error) {
      console.error("Failed to clear filters:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [filterOptions, fetchFilteredData, saveScrollPosition]);

  const handleCheckboxChange = useCallback(
    async (groupIndex: number, optionIndex: number, isChecked: boolean) => {
      saveScrollPosition();

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

  const handleWeekChange = useCallback(
    (week: string) => {
      saveScrollPosition();
      setSelectedWeek(week);
    },
    [saveScrollPosition]
  );

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

  // ----------------------------------------------------------------------
  //  REVISED useEffect WITH EMPTY DEPENDENCY ARRAY FOR POLLING EVERY 30 MIN
  // ----------------------------------------------------------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const queryParams = constructQueryParams([]);
        const response = await fetch(
          `/api/happiness-score/dashboards/getCompanyDashboardData?${queryParams}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        // Initialize filter options
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
        setAgGridTableData(data.data);
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

    const intervalId = setInterval(() => {
      fetchInitialData();
    }, 600000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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

  useLayoutEffect(() => {
    if (!isUpdating && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition.current;
    }
  }, [isUpdating]);

  // ------------------------------------------------------------
  //  Props passed to child components for clarity and reusability
  // ------------------------------------------------------------

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
