"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useTheme,
  VStack,
  Avatar,
  useBreakpointValue,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";

import LineGraph from "@/components/graphs/LineGraph";
import { HappinessScoreMasonry } from "../../HappinessScoreMasonry";
import SpeechBubble from "../../SpeechBubble";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { SpringScale } from "@/components/animations/SpringScale";
import StaffHappinessDetailModal from "./StaffHappinessDetailModal";
import { useRouter } from "next/navigation";
import { ColDef } from "ag-grid-community";

import { AgBarChart } from "@/components/graphs/AgBarChart";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";

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
  site: string;
  score: number | null;
  imageUrl: string;
  fullName: string;
}

interface ManagerDashboardPageInnerProps {
  loading: boolean;
  speechBubbleData: SpeechBubbleData | null;
  lineGraphData: DataPoint[];
  masonryData: number[];
  peopleListData: Person[];
  departmentsData: {
    department: string;
    averageScore: number;
    count: number;
  }[];
  sitesData: { site: string; averageScore: number; count: number }[];
  fetchHappinessScoreTwoMonthHistory: (userId: number) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  staffHappinessDetailsModalData: any;
  drawerState: "closed" | "fully-open";
}

export default function ManagerDashboardInner({
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
}: ManagerDashboardPageInnerProps) {
  const theme = useTheme();
  const router = useRouter();

  const hideJobTitle = useBreakpointValue({ base: true, sm: false });
  const hideSite = useBreakpointValue({ base: true, lg: false });
  const hideDepartment = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    console.log(peopleListData);
  }, [peopleListData]);

  const columnDefs = useMemo<ColDef<Person>[]>(() => {
    return [
      {
        headerName: "Image",
        field: "imageUrl",
        sortable: false,
        filter: false,
        flex: 1,
        cellRenderer: (params: any) => {
          return (
            <Flex justifyContent="center" alignItems="center" w="100%">
              <Avatar
                name={params.data.fullName}
                src={params.data.imageUrl}
                boxSize="40px"
                objectFit="cover"
              />
            </Flex>
          );
        },
        cellStyle: { color: "black" },
      },
      {
        headerName: "Name",
        field: "fullName",
        sortable: true,
        filter: true,
        flex: 1,
        cellStyle: { color: "black" },
      },
      {
        headerName: "Score",
        field: "score",
        sortable: true,
        filter: true,
        flex: 1,
        valueFormatter: (params) => {
          return params.value === null ? "N/A" : `${params.value}`;
        },
        cellStyle: { color: "black" },
      },
      {
        headerName: "Job Title",
        field: "jobTitle",
        sortable: true,
        filter: true,
        flex: 1,
        hide: hideJobTitle,
        cellStyle: { color: "black" },
      },
      {
        headerName: "Department",
        field: "department",
        sortable: true,
        filter: true,
        flex: 1,
        hide: hideDepartment,
        cellStyle: { color: "black" },
      },
      {
        headerName: "Site",
        field: "site",
        sortable: true,
        filter: true,
        flex: 1,
        hide: hideSite,
        cellStyle: { color: "black" },
      },
    ];
  }, [hideJobTitle, hideSite, hideDepartment]);

  const [barModalData, setBarModalData] = useState<Person[]>([]);
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barModalTitle, setBarModalTitle] = useState("");

  // const refreshPage = useCallback(() => {
  //   router.refresh();
  // }, [router]);

  // useEffect(() => {
  //   const timer = setTimeout(refreshPage, 10 * 60 * 1000);
  //   return () => clearTimeout(timer);
  // }, [refreshPage]);

  const handleDepartmentBarClick = useCallback(
    (title: string) => {
      const filteredPeople = peopleListData.filter(
        (person) => person.department === title && person.score !== null
      );
      setBarModalTitle(`Department: ${title}`);
      setBarModalData(filteredPeople);
      setIsBarModalOpen(true);
    },
    [peopleListData]
  );

  const handleSiteBarClick = useCallback(
    (title: string) => {
      const filteredPeople = peopleListData.filter(
        (person) => person.site === title && person.score !== null
      );
      setBarModalTitle(`Site: ${title}`);
      setBarModalData(filteredPeople);
      setIsBarModalOpen(true);
    },
    [peopleListData]
  );

  const handleMasonryClick = useCallback(
    (category: string) => {
      if (category === "Did not participate") {
        const nonParticipants = peopleListData.filter(
          (person) => person.score === null || person.score === undefined
        );
        setBarModalTitle("Did Not Participate");
        setBarModalData(nonParticipants);
        setIsBarModalOpen(true);
        return;
      }

      let minScore = 0;
      let maxScore = 0;
      if (category === "1-2") {
        minScore = 1;
        maxScore = 2;
      } else if (category === "3-5") {
        minScore = 3;
        maxScore = 5;
      } else if (category === "6-8") {
        minScore = 6;
        maxScore = 8;
      } else if (category === "9-10") {
        minScore = 9;
        maxScore = 10;
      } else {
        return;
      }

      const filteredPeople = peopleListData.filter(
        (person) =>
          person.score !== null &&
          person.score >= minScore &&
          person.score <= maxScore
      );

      setBarModalTitle(`Score Range: ${category}`);
      setBarModalData(filteredPeople);
      setIsBarModalOpen(true);
    },
    [peopleListData]
  );

  const handleUserClick = useCallback(
    (userId: number) => {
      fetchHappinessScoreTwoMonthHistory(userId);
      setIsBarModalOpen(false);
    },
    [fetchHappinessScoreTwoMonthHistory]
  );

  const departmentBarData = useMemo(
    () =>
      departmentsData.map((dept) => ({
        title: dept.department,
        value: dept.averageScore,
        count: dept.count,
      })),
    [departmentsData]
  );

  const siteBarData = useMemo(
    () =>
      sitesData.map((site) => ({
        title: site.site,
        value: site.averageScore,
        count: site.count,
      })),
    [sitesData]
  );

  return (
    <>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" color="perygonPink" />
        </Flex>
      ) : (
        <Box mb={[10, 0]}>
          {staffHappinessDetailsModalData && (
            <StaffHappinessDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              {...staffHappinessDetailsModalData}
            />
          )}

          <Modal
            isOpen={isBarModalOpen}
            onClose={() => setIsBarModalOpen(false)}
            size="5xl"
          >
            <ModalOverlay />
            <ModalContent bgGradient={theme.gradients.perygonBackground}>
              <ModalHeader color="white">{barModalTitle}</ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody pb={10}>
                <VStack minHeight={520}>
                  {barModalData.length > 0 ? (
                    <Box
                      className="ag-theme-alpine"
                      w="100%"
                      p={1}
                      pb="7px"
                      borderRadius="xl"
                      boxShadow="md"
                      bgColor="white"
                    >
                      <DataGridComponentLight
                        data={barModalData}
                        initialFields={columnDefs}
                        defaultColDef={{
                          flex: 1,
                          minWidth: 100,
                          resizable: true,
                        }}
                        showTopBar={false}
                        handleRowClick={(person) =>
                          handleUserClick(person.userId)
                        }
                      />
                    </Box>
                  ) : (
                    <Text color="white">No data available.</Text>
                  )}
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Grid
            templateColumns={["1fr", null, null, "1fr 1fr 1fr 1fr 1fr 1fr"]}
            gap={[8, 6]}
            mt={6}
          >
            <GridItem colSpan={[1, null, null, 3]}>
              <SpringScale>
                <Flex maxWidth={600} flexDirection="column">
                  <Flex width="100%" justifyContent="center" mb={4}>
                    <SectionHeader>This Week&apos;s Average</SectionHeader>
                  </Flex>
                  <SpeechBubble
                    score={speechBubbleData?.currentScore || 0}
                    change={speechBubbleData?.change || 0}
                    positiveChange={speechBubbleData?.positiveChange || false}
                  />
                </Flex>
              </SpringScale>
            </GridItem>

            <GridItem colSpan={[1, null, null, 3]}>
              <SpringScale>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Trend</SectionHeader>
                </Flex>
                <LineGraph DataPoints={lineGraphData} />
              </SpringScale>
            </GridItem>

            <GridItem colSpan={[1, null, null, 2]}>
              <Flex width="100%" justifyContent="center" mb={4}>
                <SectionHeader>Breakdown</SectionHeader>
              </Flex>
              <HappinessScoreMasonry
                masonryValues={masonryData}
                onStatClick={handleMasonryClick}
              />
            </GridItem>

            <GridItem colSpan={[1, null, null, 4]}>
              <VStack minH="100%">
                <Flex width="100%" justifyContent="center" mb={2}>
                  <SectionHeader>Submissions</SectionHeader>
                </Flex>

                <Box
                  className="ag-theme-alpine"
                  w="100%"
                  p={1}
                  pb="7px"
                  borderRadius="xl"
                  boxShadow="md"
                  bgColor="white"
                >
                  <DataGridComponentLight
                    data={peopleListData}
                    initialFields={columnDefs}
                    defaultColDef={{
                      flex: 1,
                      minWidth: 100,
                      resizable: true,
                    }}
                    showTopBar={false}
                    handleRowClick={(person) => handleUserClick(person.userId)}
                  />
                </Box>
              </VStack>
            </GridItem>

            <GridItem colSpan={[1, null, null, 3]}>
              {departmentBarData && (
                <VStack height="100%">
                  <Flex width="100%" justifyContent="center" mb={4}>
                    <SectionHeader>Department Comparison</SectionHeader>
                  </Flex>
                  <AgBarChart
                    data={departmentBarData}
                    onBarClick={handleDepartmentBarClick}
                  />
                </VStack>
              )}
            </GridItem>

            <GridItem colSpan={[1, null, null, 3]}>
              <VStack>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Site Comparison</SectionHeader>
                </Flex>
                <AgBarChart
                  data={siteBarData}
                  onBarClick={handleSiteBarClick}
                />
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      )}
    </>
  );
}
