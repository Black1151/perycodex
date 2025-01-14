import React from "react";
import {
  Box,
  Flex,
  IconButton,
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

interface CustomGridBottomPaginationProps {
  gridRef: React.RefObject<AgGridReact>;
  paginationInfo: PaginationInfo;
  onPageChange: () => void;
}

const CustomGridBottomPagination: React.FC<CustomGridBottomPaginationProps> = ({
  gridRef,
  paginationInfo,
  onPageChange,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const goToNextPage = () => {
    gridRef.current?.api.paginationGoToNextPage();
    onPageChange();
  };

  const goToPreviousPage = () => {
    gridRef.current?.api.paginationGoToPreviousPage();
    onPageChange();
  };

  const pageDisplay = `Page ${paginationInfo.currentPage == 0 ? 0 : paginationInfo.currentPage} of ${paginationInfo.totalPages}`;

  const rowDisplay = `${paginationInfo.totalRows == 0 ? 0 : paginationInfo.currentPage * paginationInfo.pageSize - paginationInfo.pageSize + 1} to ${paginationInfo.currentPage * paginationInfo.pageSize < paginationInfo.totalRows ? paginationInfo.currentPage * paginationInfo.pageSize : paginationInfo.totalRows} of ${paginationInfo.totalRows}`;

  return (
    <Box w={"full"} px={1} color={"black"}>
      <Flex
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent={isMobile ? "center" : "space-between"}
      >
        <Flex
          direction={"column"}
          justify={"center"}
          align={isMobile ? "center" : "flex-start"}
          gap={isMobile ? 1 : 2}
        >
          {!isMobile && <Text color="black">{pageDisplay}</Text>}
          {/* <Text color="black">{rowDisplay}</Text> */}
        </Flex>

        <Flex
          gap={isMobile ? 1 : 2}
          justifyContent={isMobile ? "center" : "center"}
          align={"center"}
        >
          <Flex justifyContent="center" align={"center"} gap={isMobile ? 1 : 2}>
            <IconButton
              aria-label="Previous Page"
              icon={<KeyboardArrowLeft />}
              size={isMobile ? "sm" : "md"}
              onClick={goToPreviousPage}
              variant="agPrimary"
              color="black"
              my={2}
              _hover={{
                backgroundColor: "perygonPink",
                color: "white",
              }}
            />
            <IconButton
              aria-label="Next Page"
              icon={<KeyboardArrowRight />}
              size={isMobile ? "sm" : "md"}
              onClick={goToNextPage}
              variant="agPrimary"
              my={2}
              color="black"
              _hover={{
                backgroundColor: "perygonPink",
                color: "white",
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomGridBottomPagination;
