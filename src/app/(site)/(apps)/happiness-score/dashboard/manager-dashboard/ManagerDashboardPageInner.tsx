"use client";

import React, { useMemo, useEffect, useCallback, useState } from "react";
import {
  Grid,
  GridItem,
  Flex,
  Spinner,
  VStack,
  useTheme,
} from "@chakra-ui/react";
import LineGraph from "@/components/graphs/LineGraph";
import { HappinessScoreMasonry } from "../../HappinessScoreMasonry";
import SpeechBubble from "../../SpeechBubble";
import PeopleList from "./PeopleList";
import AnimatedBarChart from "@/components/graphs/BarGraph";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { SpringScale } from "@/components/animations/SpringScale";
import StaffHappinessDetailModal from "./StaffHappinessDetailModal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

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
  score: number;
  imageUrl: string;
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

export default function ManagerDashboardPageInner({
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [barModalData, setBarModalData] = useState<Person[]>([]);
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);
  const [barModalTitle, setBarModalTitle] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState<number>(1);
  const [modalItemsPerPage, setModalItemsPerPage] = useState<number>(10);
  const theme = useTheme();

  const handleDepartmentBarClick = useCallback(
    (title: string) => {
      const filteredPeople = peopleListData.filter(
        (person) => person.department === title
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
        (person) => person.site === title
      );
      setBarModalTitle(`Site: ${title}`);
      setBarModalData(filteredPeople);
      setIsBarModalOpen(true);
    },
    [peopleListData]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [peopleListData]);

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
          <Modal
            isOpen={isBarModalOpen}
            onClose={() => setIsBarModalOpen(false)}
            size="5xl"
          >
            <ModalOverlay />
            <ModalContent bgGradient={theme.gradients.perygonBackground}>
              <ModalHeader color="white">{barModalTitle}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={10}>
                <PeopleList
                  people={barModalData}
                  currentPage={modalCurrentPage}
                  itemsPerPage={modalItemsPerPage}
                  onPageChange={setModalCurrentPage}
                  onItemsPerPageChange={setModalItemsPerPage}
                  handleUserClick={fetchHappinessScoreTwoMonthHistory}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
          <Grid
            templateColumns={["1fr", null, "1fr 1fr 1fr 1fr 1fr 1fr"]}
            gap={[20, 6]}
          >
            <GridItem colSpan={[1, null, 3]}>
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

            <GridItem colSpan={[1, null, 3]}>
              <SpringScale>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Trend</SectionHeader>
                </Flex>
                <LineGraph DataPoints={lineGraphData} />
              </SpringScale>
            </GridItem>
            <GridItem colSpan={[1, null, 2]}>
              <Flex width="100%" justifyContent="center" mb={4}>
                <SectionHeader>Breakdown</SectionHeader>
              </Flex>
              <HappinessScoreMasonry
                masonryValues={masonryData}
                onStatClick={handleMasonryClick}
              />
            </GridItem>
            <GridItem colSpan={[1, null, 4]}>
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
            <GridItem colSpan={[1, null, 3]}>
              <VStack>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Department Comparison</SectionHeader>
                </Flex>
                <AnimatedBarChart
                  DataPoints={departmentBarData}
                  onBarClick={handleDepartmentBarClick}
                />
              </VStack>
            </GridItem>
            <GridItem colSpan={[1, null, 3]}>
              <VStack>
                <Flex width="100%" justifyContent="center" mb={4}>
                  <SectionHeader>Site Comparison</SectionHeader>
                </Flex>
                <AnimatedBarChart
                  DataPoints={siteBarData}
                  onBarClick={handleSiteBarClick}
                />
              </VStack>
            </GridItem>
          </Grid>
        </>
      )}
    </>
  );
}
