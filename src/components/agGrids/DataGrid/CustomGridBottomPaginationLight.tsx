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

interface CustomGridBottomPaginationLightProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onChangePageSize: (newSize: number) => void;
}

function getPageSizeOptions(totalRows: number) {
  const baseSizes = [10, 25, 50, 100];
  const filtered = baseSizes.filter((size) => size <= totalRows);

  if (filtered.length === 0) {
    return [totalRows];
  }

  if (totalRows > filtered[filtered.length - 1]) {
    filtered.push(totalRows);
  }

  return filtered;
}

const CustomGridBottomPaginationLight: React.FC<
  CustomGridBottomPaginationLightProps
> = ({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onPreviousPage,
  onNextPage,
  onChangePageSize,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const pageSizeOptions = useMemo(
    () => getPageSizeOptions(totalRows),
    [totalRows]
  );

  const paginationText = isMobile
    ? `${currentPage} of ${totalPages}`
    : `Page ${currentPage} of ${totalPages}`;

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
            value={pageSize}
            onChange={(e) => onChangePageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Text>of {totalRows}</Text>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text mx={1} minWidth={["60px", null, "120px"]} textAlign="center">
            {paginationText}
          </Text>
          <IconButton
            aria-label="Previous Page"
            icon={<KeyboardArrowLeft />}
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
            variant="agPrimary"
            color="black"
            _hover={{
              backgroundColor: "perygonPink",
              color: "white",
            }}
          />
          <IconButton
            aria-label="Next Page"
            icon={<KeyboardArrowRight />}
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            variant="agPrimary"
            color="black"
            _hover={{
              backgroundColor: "perygonPink",
              color: "white",
            }}
          />
        </HStack>
      </Grid>
    </Box>
  );
};

export default CustomGridBottomPaginationLight;
