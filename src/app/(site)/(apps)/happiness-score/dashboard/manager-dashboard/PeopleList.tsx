import React from "react";
import {
  Avatar,
  Box,
  Grid,
  HStack,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Person {
  userId: number;
  fullName: string;
  jobTitle: string;
  department: string;
  site: string;
  score: number;
  imageUrl: string;
}

interface PeopleListProps {
  people: Person[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  handleUserClick: (userId: number) => void;
}

const PeopleList: React.FC<PeopleListProps> = ({
  people,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  handleUserClick,
}) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Person;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedPeople = React.useMemo(() => {
    const sorted = [...people].sort((a, b) => {
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
    return sorted;
  }, [people, sortConfig]);

  const totalPages = Math.ceil(sortedPeople.length / itemsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPeople.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onItemsPerPageChange(Number(event.target.value));
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  const columns = [
    {
      key: "imageUrl",
      label: "",
      sortable: false,
      width: "60px",
    },
    {
      key: "fullName",
      label: "Name",
      sortable: true,
    },
    {
      key: "jobTitle",
      label: "Job Title",
      sortable: true,
      display: ["none", null, null, null, "table-cell"],
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      display: ["none", "table-cell"],
    },
    {
      key: "site",
      label: "Site",
      sortable: true,
      display: ["none", "table-cell"],
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      width: "100px",
    },
  ];

  return (
    <VStack
      p={4}
      borderWidth={1}
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      maxW="100%"
      minH="100%"
      flex={1}
      justifyContent="space-between"
    >
      <TableContainer
        overflowX="auto"
        overflowY="auto"
        maxHeight={428}
        width="100%"
      >
        <Table variant="unstyled" colorScheme="gray" size="sm" layout="fixed">
          <Thead>
            <Tr>
              {columns.map(({ key, label, sortable, width, display }) => (
                <Th
                  key={key}
                  cursor={sortable ? "pointer" : "default"}
                  onClick={() => sortable && handleSort(key as keyof Person)}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  bg="white"
                  position="sticky"
                  top="0"
                  zIndex={1}
                  width={width || "auto"} // Apply width if specified
                  display={display || "table-cell"}
                  textTransform="none"
                >
                  <HStack spacing={2}>
                    <Text fontSize={["xs", "sm"]}>{label}</Text>
                    {sortable && (
                      <Box w="40px" textAlign="center">
                        {getSortIcon(key as keyof Person)}
                      </Box>
                    )}
                  </HStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((person, index) => (
              <Tr
                key={`${person.userId}-${index}`}
                bg={index % 2 === 0 ? "white" : "gray.100"}
                _hover={{
                  bg: "perygonPink",
                  color: "white",
                  cursor: "pointer",
                }}
                transition="background-color 0.15s ease, color 0.15s ease"
                onClick={() => handleUserClick(person.userId)}
              >
                {columns.map(({ key, display, width }) => {
                  if (key === "imageUrl") {
                    return (
                      <Td
                        key={key}
                        display={display || "table-cell"}
                        width={width} // Apply width to constrain the image column
                      >
                        <Avatar
                          src={person.imageUrl}
                          name={person.fullName}
                          size="sm"
                        />
                      </Td>
                    );
                  } else {
                    return (
                      <Td
                        key={key}
                        display={display || "table-cell"}
                        width={width || "auto"} // Apply fixed width to score column
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                      >
                        {person[key as keyof Person]}
                      </Td>
                    );
                  }
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid mt={4} width="100%" templateColumns="1fr 1fr">
        <HStack>
          <Text display={["none", null, null, null, "block"]} mr={2}>
            Rows per page:
          </Text>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="sm"
            width="auto"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
        </HStack>
        <HStack justifyContent="flex-end">
          <IconButton
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            icon={<ChevronLeftIcon />}
            aria-label="Previous page"
            size="sm"
          />
          <Text
            display={["none", null, null, null, "block"]}
            mx={2}
            minWidth={120}
            textAlign="center"
          >
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages || totalPages === 0}
            icon={<ChevronRightIcon />}
            aria-label="Next page"
            size="sm"
          />
        </HStack>
      </Grid>
    </VStack>
  );
};

export default PeopleList;
