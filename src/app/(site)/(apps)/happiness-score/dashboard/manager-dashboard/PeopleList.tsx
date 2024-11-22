import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Person {
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  score: number;
}

interface PeopleListProps {
  people: Person[];
}

const PeopleList: React.FC<PeopleListProps> = ({ people }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Person;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedPeople = [...people].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof Person) => {
    setSortConfig((prevState) => {
      if (prevState?.key === key && prevState.direction === "ascending") {
        return { key, direction: "descending" };
      }
      return { key, direction: "ascending" };
    });
  };

  const getSortIcon = (key: keyof Person) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowDropUpIcon />
    ) : (
      <ArrowDropDownIcon />
    );
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="2xl"
      overflowX="auto"
      bg="white"
      maxW="100%"
      maxH={520}
    >
      <TableContainer>
        <Table variant="unstyled" colorScheme="gray" size="sm" layout="fixed">
          <Thead>
            <Tr>
              {[
                { key: "firstName", label: "First Name" },
                { key: "lastName", label: "Last Name" },
                { key: "jobTitle", label: "Job Title" },
                { key: "department", label: "Department" },
                { key: "score", label: "Score" },
              ].map(({ key, label }) => (
                <Th
                  key={key}
                  cursor="pointer"
                  onClick={() => handleSort(key as keyof Person)}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  <HStack spacing={2}>
                    <Text fontSize={["xs", "sm"]}>{label}</Text>
                    <Box w="20px" textAlign="center">
                      {getSortIcon(key as keyof Person)}
                    </Box>
                  </HStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {sortedPeople.map((person, index) => (
              <Tr
                key={index}
                bg={index % 2 === 0 ? "white" : "gray.100"}
                _hover={{
                  bg: "perygonPink",
                  color: "white",
                }}
                transition="background-color 0.15s ease, color 0.15s ease"
              >
                <Td
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {person.firstName}
                </Td>
                <Td
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {person.lastName}
                </Td>
                <Td
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {person.jobTitle}
                </Td>
                <Td
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {person.department}
                </Td>
                <Td
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {person.score}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PeopleList;
