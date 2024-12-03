import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
}

interface CustomGridBottomPaginationProps {
  gridRef: React.RefObject<AgGridReact>;
  paginationInfo: PaginationInfo;
  setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>;
  allowedToChangePageSize: boolean;
  onPageChange: () => void;
}

const CustomGridBottomPagination: React.FC<CustomGridBottomPaginationProps> = ({
  gridRef,
  paginationInfo,
  setPaginationInfo,
  allowedToChangePageSize,
  onPageChange,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const handlePaginationSizeChange = (value: string) => {
    const newSize =
      value === "all" ? paginationInfo.totalRows : parseInt(value, 10);
    setPaginationInfo((prev) => ({
      ...prev,
      pageSize: newSize,
    }));
  };

  const pageDisplay = `Page ${paginationInfo.currentPage == 0 ? 0 : paginationInfo.currentPage} of ${paginationInfo.totalPages}`;

  const rowDisplay = `${paginationInfo.totalRows == 0 ? 0 : paginationInfo.currentPage * paginationInfo.pageSize - paginationInfo.pageSize + 1} to ${paginationInfo.currentPage * paginationInfo.pageSize < paginationInfo.totalRows ? paginationInfo.currentPage * paginationInfo.pageSize : paginationInfo.totalRows} of ${paginationInfo.totalRows}`;

  return (
    <Box
      w={"full"}
      px={4}
      pt={2}
      borderTop={"1px solid white"}
      borderBottom={"1px solid white"}
      color={"white"}
    >
      <Flex
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent={isMobile ? "center" : "space-between"}
        gap={isMobile ? 1 : 2}
      >
        <Flex
          direction={"column"}
          justify={"center"}
          align={isMobile ? "center" : "flex-start"}
          gap={isMobile ? 1 : 2}
        >
          {!isMobile && <Text>{pageDisplay}</Text>}
          <Text>{rowDisplay}</Text>
        </Flex>

        <Flex
          gap={isMobile ? 1 : 2}
          justifyContent={isMobile ? "space-between" : "center"}
          align={"center"}
        >
          <Flex justifyContent="center" align={"center"} gap={isMobile ? 1 : 2}>
            {allowedToChangePageSize && (
              <>
                <Text>Rows per page:</Text>
                <Select
                  onChange={(e) => handlePaginationSizeChange(e.target.value)}
                  value={paginationInfo.pageSize}
                  size={isMobile ? "xs" : "md"}
                  width={"auto"}
                  bg="white"
                  color="perygonPink"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="all">All</option>
                </Select>
              </>
            )}
          </Flex>
          <Flex justifyContent="center" align={"center"} gap={isMobile ? 1 : 2}>
            <Button
              size={isMobile ? "sm" : "md"}
              onClick={goToFirstPage}
              variant="agPrimary"
              my={2}
            >
              <KeyboardArrowLeft />
            </Button>
            <IconButton
              aria-label="Previous Page"
              icon={<ArrowBack />}
              size={isMobile ? "sm" : "md"}
              onClick={goToPreviousPage}
              variant="agPrimary"
              my={2}
            />

            <IconButton
              aria-label="Next Page"
              icon={<ArrowForward />}
              size={isMobile ? "sm" : "md"}
              onClick={goToNextPage}
              variant="agPrimary"
              my={2}
            />
            <Button
              size={isMobile ? "sm" : "md"}
              onClick={goToLastPage}
              variant="agPrimary"
              my={2}
            >
              <KeyboardArrowRight />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomGridBottomPagination;
