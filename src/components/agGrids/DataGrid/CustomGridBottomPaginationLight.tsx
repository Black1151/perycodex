import React, { useMemo } from "react";
import {
  Box,
  Grid,
  HStack,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
}

interface CustomGridBottomPaginationLightProps {
  gridRef: React.RefObject<AgGridReact>;
  paginationInfo: PaginationInfo;
  onPageChange: () => void;
  setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>;
}

function getPageSizeOptions(totalRows: number) {
  const baseSizes = [10, 25, 50, 100, 250];
  let filtered = baseSizes.filter((size) => size <= totalRows);

  if (totalRows <= 500) {
    filtered.push(totalRows); // Add totalRows if it's less than or equal to 1000
  } else {
    filtered.push(500); // Add 1000 as the max if totalRows exceeds 1000
  }

  return filtered;
}

const CustomGridBottomPaginationLight: React.FC<
  CustomGridBottomPaginationLightProps
> = ({ gridRef, paginationInfo, onPageChange, setPaginationInfo }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const pageSizeOptions = useMemo(
    () => getPageSizeOptions(paginationInfo.totalRows),
    [paginationInfo.totalRows]
  );

  const goToFirstPage = () => {
    gridRef.current?.api.paginationGoToFirstPage();
    onPageChange();
  };

  const goToLastPage = () => {
    gridRef.current?.api.paginationGoToLastPage();
    onPageChange();
  };

  const goToNextPage = () => {
    gridRef.current?.api.paginationGoToNextPage();
    onPageChange();
  };

  const goToPreviousPage = () => {
    gridRef.current?.api.paginationGoToPreviousPage();
    onPageChange();
  };

  const paginationText = isMobile
    ? `${paginationInfo.currentPage} of ${paginationInfo.totalPages}`
    : `Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`;

  return (
    <Box w="full" px={1} color="black" mt={2}>
      <Grid templateColumns="1fr 1fr" alignItems="center">
        <HStack>
          <Text display={["none", null, null, null, "block"]} mr={2}>
            Showing:
          </Text>
          <Select
            size="sm"
            width="auto"
            value={paginationInfo.pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              if (gridRef.current?.api) {
                // Correct method to set the page size
                gridRef.current.api.setGridOption(
                  "paginationPageSize",
                  newPageSize
                );
                // Update the pagination info state
                setPaginationInfo((prev) => ({
                  ...prev,
                  pageSize: newPageSize,
                  totalPages: Math.ceil(prev.totalRows / newPageSize), // Use prev to access the current totalRows
                }));
              }
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Text>of {paginationInfo.totalRows}</Text>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text mx={1} minWidth={["60px", null, "120px"]} textAlign="center">
            {paginationText}
          </Text>
          <IconButton
            aria-label="Previous Page"
            icon={<KeyboardArrowLeft />}
            size="sm"
            onClick={goToPreviousPage}
            disabled={paginationInfo.currentPage <= 1}
            variant="agPrimary"
            color="black"
            _hover={{
              backgroundColor: "primary",
              color: "white",
            }}
          />
          <IconButton
            aria-label="Next Page"
            icon={<KeyboardArrowRight />}
            size="sm"
            onClick={goToNextPage}
            disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
            variant="agPrimary"
            color="black"
            _hover={{
              backgroundColor: "primary",
              color: "white",
            }}
          />
        </HStack>
      </Grid>
    </Box>
  );
};

export default CustomGridBottomPaginationLight;
