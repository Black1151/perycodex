"use client";

import React, { useMemo, useEffect, useCallback, useState } from "react";
import { Grid, GridItem, Flex, Spinner, VStack } from "@chakra-ui/react";
import LineGraph from "@/components/graphs/LineGraph";
import { HappinessScoreMasonry } from "../../HappinessScoreMasonry";
import SpeechBubble from "../../SpeechBubble";
import PeopleList from "./PeopleList";
import AnimatedBarChart from "@/components/graphs/BarGraph";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { SpringScale } from "@/components/animations/SpringScale";
import StaffHappinessDetailModal from "./StaffHappinessDetailModal";

interface DataPoint {
  value: number;
  title: string;
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

interface ManagerDashboardPageInnerProps {
  loading: boolean;
  speechBubbleData: SpeechBubbleData | null;
  lineGraphData: DataPoint[];
  masonryData: number[];
  peopleListData: Person[];
  departmentsData: { department: string; averageScore: number }[];
  sitesData: { site: string; averageScore: number }[];
  selectedTimeRange: string;
  fetchHappinessScoreTwoMonthHistory: (userId: number) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  staffHappinessDetailsModalData: any;
  setDrawerState: (state: "closed" | "fully-open") => void;
  drawerState: "closed" | "fully-open";
}

export default function ManagerDashboardPageInner({
  loading,
  speechBubbleData,
  lineGraphData,
  masonryData,
  peopleListData,
  departmentsData,
  sitesData,
  selectedTimeRange,
  fetchHappinessScoreTwoMonthHistory,
  isModalOpen,
  setIsModalOpen,
  staffHappinessDetailsModalData,
  setDrawerState,
  drawerState,
}: ManagerDashboardPageInnerProps) {
  // Memoize departmentBarData and siteBarData
  const departmentBarData = useMemo(
    () =>
      departmentsData.map((dept) => ({
        title: dept.department,
        value: dept.averageScore,
      })),
    [departmentsData]
  );

  const siteBarData = useMemo(
    () =>
      sitesData.map((site) => ({
        title: site.site,
        value: site.averageScore,
      })),
    [sitesData]
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Reset current page when peopleListData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [peopleListData]);

  // handleMasonryClick
  const handleMasonryClick = useCallback((category: string) => {
    console.log("Masonry category clicked:", category);
  }, []);

  return (
    <>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" color="perygonPink" />
        </Flex>
      ) : (
        <>
          {staffHappinessDetailsModalData && (
            <StaffHappinessDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              {...staffHappinessDetailsModalData}
            />
          )}
          <Grid
            templateColumns={["1fr", null, "1fr 1fr"]}
            gap={[20, 6]}
            mr={[0, null, null, 40]}
          >
            <GridItem>
              <SpringScale>
                <Flex maxWidth={600} flexDirection="column">
                  <Flex width="100%" justifyContent="center" mb={4}>
                    <SectionHeader>This Week's Average</SectionHeader>
                  </Flex>
                  <SpeechBubble
                    score={speechBubbleData?.currentScore || 0}
                    change={speechBubbleData?.change || 0}
                    positiveChange={speechBubbleData?.positiveChange || false}
                  />
                </Flex>
              </SpringScale>
            </GridItem>

            <GridItem>
              <SpringScale>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Trend</SectionHeader>
                </Flex>
                <LineGraph DataPoints={lineGraphData} />
              </SpringScale>
            </GridItem>
            <GridItem>
              <Flex width="100%" justifyContent="center" mb={4}>
                <SectionHeader>Breakdown</SectionHeader>
              </Flex>
              <HappinessScoreMasonry
                masonryValues={masonryData}
                onStatClick={handleMasonryClick}
              />
            </GridItem>
            <GridItem>
              <VStack minH="100%">
                <Flex width="100%" justifyContent="center" mb={2}>
                  <SectionHeader>Submissions</SectionHeader>
                </Flex>
                <PeopleList
                  people={peopleListData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  handleUserClick={fetchHappinessScoreTwoMonthHistory}
                />
              </VStack>
            </GridItem>
            <GridItem>
              <VStack>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Department Comparison</SectionHeader>
                </Flex>
                <AnimatedBarChart DataPoints={departmentBarData} />
              </VStack>
            </GridItem>
            <GridItem>
              <VStack>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Site Comparison</SectionHeader>
                </Flex>
                <AnimatedBarChart DataPoints={siteBarData} />
              </VStack>
            </GridItem>
          </Grid>
        </>
      )}
    </>
  );
}
