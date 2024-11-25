"use client";

import React, { useState, useEffect, useRef } from "react";
import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import LineGraph from "@/components/graphs/LineGraph";
import { HappinessScoreMasonry } from "../../HappinessScoreMasonry";
import SpeechBubble from "../../SpeechBubble";
import { DashboardFilteringDrawer } from "@/components/layout/DashboardFilteringDrawer";
import PeopleList from "./PeopleList";
import AnimatedBarChart from "@/components/graphs/BarGraph";

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
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  score: number;
}

export default function ManagerDashboardPage() {
  const isInitialMount = useRef(true);
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

  // Mapping from filter labels to API parameter names
  const labelToParamName: Record<string, string> = {
    "Dept Name": "deptId",
    "Team Name": "teamId",
    Role: "role",
    "Job Level Name": "jobLevel",
    "Contract Type Name": "contractTypeId",
    "Remote Worker": "remoteWorker",
    "Site Name": "siteId",
  };

  const clearAllFilters = () => {
    const clearedFilters = filterOptions.map((group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        isSelected: false, // Reset isSelected to false
      })),
    }));
    setFilterOptions(clearedFilters);
    fetchFilteredData(clearedFilters); // Fetch data with cleared filters
  };

  // Function to construct query parameters from selected filters
  const constructQueryParams = (filters: FilterOptionGroup[]): string => {
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

    return params.toString();
  };

  // Function to update filter options based on new data
  const updateFilterOptions = (
    newFilters: FilterOptionGroup[],
    currentFilters: FilterOptionGroup[]
  ) => {
    const updatedFilters = currentFilters.map((group) => {
      const newGroup = newFilters.find((g) => g.label === group.label);
      if (newGroup) {
        const updatedOptions = group.options.map((option) => {
          const newOption = newGroup.options.find(
            (o) => o.value === option.value
          );
          return {
            ...option,
            isDisabled: !newOption, // Disable if not present in new data
          };
        });
        return {
          ...group,
          options: updatedOptions,
        };
      } else {
        // If group doesn't exist in new data, disable all options
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
  };

  const fetchFilteredData = async (currentFilters: FilterOptionGroup[]) => {
    const queryParams = constructQueryParams(currentFilters);
    const response = await fetch(
      `/api/happiness-graphs/getManagerDashboardData?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    // Update filter options
    updateFilterOptions(data.filterOptions, currentFilters);

    // Update other data
    setLineGraphData(data.lineGraphData);
    setWeeksData(data.weeksData);

    // Extract week options
    const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
    setWeekOptions(weekTitles);
    setSelectedWeek(weekTitles[weekTitles.length - 1]); // Set to most recent week
  };

  const handleCheckboxChange = (
    groupIndex: number,
    optionIndex: number,
    isChecked: boolean
  ) => {
    // Update filter options with the new checked state
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
    // Fetch data with updated filters
    fetchFilteredData(updatedFilters);
  };

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          `/api/happiness-graphs/getManagerDashboardData`
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

        // Extract week options
        const weekTitles = data.lineGraphData.map((dp: DataPoint) => dp.title);
        setWeekOptions(weekTitles);
        setSelectedWeek(weekTitles[weekTitles.length - 1]); // Set to most recent week

        isInitialMount.current = false;
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleMasonryClick = (category: string) => {
    console.log("Masonry category clicked:", category);
  };

  // Update displayed data when selectedWeek changes
  useEffect(() => {
    if (selectedWeek && weeksData.length > 0) {
      const weekDataIndex = weeksData.findIndex(
        (wd) => wd.weekKey === selectedWeek
      );
      if (weekDataIndex !== -1) {
        const weekData = weeksData[weekDataIndex];
        // Compute change compared to previous week
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

  // Map data for bar charts
  const departmentBarData = departmentsData.map((dept) => ({
    title: dept.department,
    value: dept.averageScore,
  }));

  const siteBarData = sitesData.map((site) => ({
    title: site.site,
    value: site.averageScore,
  }));

  return (
    <>
      <DashboardFilteringDrawer
        handleCheckboxChange={handleCheckboxChange}
        filterOptions={filterOptions}
        title="Data Filters"
        clearAllFilters={clearAllFilters}
        weekOptions={weekOptions}
        selectedWeek={selectedWeek}
        onWeekChange={handleWeekChange}
      />

      <Grid
        templateColumns={["1fr", null, null, null, null, "1fr 1fr"]}
        gap={[20, 6]}
        mr={[0, null, null, 40]}
      >
        <GridItem>
          {speechBubbleData && (
            <SpeechBubble
              score={speechBubbleData.currentScore}
              change={speechBubbleData.change}
              positiveChange={speechBubbleData.positiveChange}
            />
          )}
        </GridItem>
        <GridItem>
          <LineGraph DataPoints={lineGraphData} />
        </GridItem>
        <GridItem>
          <HappinessScoreMasonry
            masonryValues={masonryData}
            onStatClick={handleMasonryClick}
          />
        </GridItem>
        <GridItem>
          <PeopleList people={peopleListData} />
        </GridItem>

        {/* Comparison bar charts */}
        <GridItem>
          <Box bg="white" p={4} borderRadius="2xl">
            <Text fontSize="xl" mb={4}>
              Department Comparison
            </Text>
            <AnimatedBarChart DataPoints={departmentBarData} />
          </Box>
        </GridItem>
        <GridItem>
          <Box bg="white" p={4} borderRadius="2xl">
            <Text fontSize="xl" mb={4}>
              Site Comparison
            </Text>
            <AnimatedBarChart DataPoints={siteBarData} />
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}
