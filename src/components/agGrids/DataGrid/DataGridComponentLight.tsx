"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import { LicenseManager } from "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Add, Clear, QueryStats, Refresh } from "@mui/icons-material";
import { ColDef, FirstDataRenderedEvent } from "ag-grid-community";
import CustomGridBottomPaginationLight from "./CustomGridBottomPaginationLight";
import LoadingOverlayPink from "../LoadingOverlayPink";

interface DataGridComponentProps<T> {
  data: T[] | null;
  initialFields: ColDef[];
  createNewUrl?: string;
  createNewUrlButtonText?: string;
  isModalEnabled?: boolean;
  loading?: boolean;
  openModalComponent?: React.ElementType;
  showTopBar?: boolean;
  defaultColDef?: ColDef;
  onGridReady?: (params: FirstDataRenderedEvent) => void;
  filterModel?: any;
  defaultPageSize?: number;
  refreshData?: () => void;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  height?: string;

  handleRowClick?: (rowData: T) => void;
}

LicenseManager.setLicenseKey("YOUR_LICENSE_KEY");

function DataGridComponentLight<T>({
  data,
  loading,
  initialFields,
  createNewUrl,
  createNewUrlButtonText,
  isModalEnabled,
  defaultPageSize = 25,
  openModalComponent: ModalComponent,
  showTopBar = true,
  defaultColDef: customDefaultColDef,
  onGridReady,
  filterModel,
  refreshData,
  enableAutoRefresh = false,
  refreshInterval = 10,
  height = "500px",
  handleRowClick,
}: DataGridComponentProps<T>) {
  const gridRef = useRef<AgGridReact>(null);
  const router = useRouter();

  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const uniqueQuickFilterId = useId();

  const [fields, setFields] = useState<ColDef[]>(initialFields);
  const [isGridReady, setIsGridReady] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const [rawData, setRawData] = useState<T[]>(() => data || []);

  const totalRows = rawData.length;
  const totalPages = totalRows > 0 ? Math.ceil(totalRows / pageSize) : 1;

  const displayedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return rawData.slice(startIndex, endIndex);
  }, [rawData, currentPage, pageSize]);

  useEffect(() => setFields(initialFields), [initialFields]);

  useEffect(() => {
    if (data) {
      setRawData(data);
    }
  }, [data]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (enableAutoRefresh && refreshData && refreshInterval > 0) {
      const intervalMs = refreshInterval * 60_000;
      timerRef.current = setInterval(() => {
        refreshData();
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (enableAutoRefresh && refreshData) {
      startTimer();
    }
  }, [enableAutoRefresh, refreshData, refreshInterval]);

  const defaultColDef = useMemo(
    () => ({
      flex: isMobile ? 0 : 1,
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
      cellStyle: { fontSize: "16px" },
      fontFamily: "Metropolis",
      ...customDefaultColDef,
    }),
    [isMobile, customDefaultColDef]
  );

  const handleGridReady = (params: FirstDataRenderedEvent) => {
    setIsGridReady(true);
    if (onGridReady) onGridReady(params);
  };

  const onFilterTextBoxChanged = useCallback(() => {
    // @ts-ignore
    gridRef.current?.api.setQuickFilter(
      (
        document.getElementById(
          `filter-text-box-${uniqueQuickFilterId}`
        ) as HTMLInputElement
      )?.value
    );
  }, [uniqueQuickFilterId]);

  const resetFilter = useCallback(() => {
    gridRef.current?.api.setFilterModel(null);
    // @ts-ignore
    gridRef.current?.api.setQuickFilter("");
    const input = document.getElementById(
      `filter-text-box-${uniqueQuickFilterId}`
    ) as HTMLInputElement;
    if (input) input.value = "";
  }, [uniqueQuickFilterId]);

  useEffect(() => {
    if (isGridReady && gridRef.current?.api && filterModel) {
      gridRef.current.api.setFilterModel(filterModel);
    }
  }, [filterModel, isGridReady]);

  const handleFilterChanged = () => {
    const currentFilterModel = gridRef.current?.api.getFilterModel();
  };

  const handleCreateNewClick = () => {
    if (isModalEnabled && ModalComponent) {
      onOpen();
    } else if (createNewUrl) {
      router.push(createNewUrl);
    }
  };

  const finalCreateNewUrlButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: createNewUrlButtonText ?? "Create New",
  });
  const resetFiltersButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: "Reset Filters",
  });
  const refreshButtonText = useBreakpointValue({
    base: "",
    sm: "",
    md: "Refresh Data",
  });

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <Box className="ag-theme-alpine" w="full" p={2} pb={0}>
      {showTopBar && (
        <Flex w="full" justify="flex-start" align="center" my={4} gap={2}>
          <Input
            variant="outline"
            id={`filter-text-box-${uniqueQuickFilterId}`}
            placeholder="Search..."
            onInput={onFilterTextBoxChanged}
            w={256}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{
              borderColor: "perygonPink",
              boxShadow: "0 0 0 1px #ff0070",
            }}
          />

          <Flex
            flex={1}
            justify="flex-end"
            align="center"
            gap={2}
            color="white"
          >
            {refreshData && (
              <Button
                variant="solid"
                bg="seduloRed"
                aria-label="refresh-data"
                onClick={refreshData}
                size="md"
                color="white"
                _hover={{ bg: "perygonPink" }}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <Refresh />
                <Text>{refreshButtonText}</Text>
              </Button>
            )}

            <Button
              variant="solid"
              bg="seduloRed"
              aria-label="reset-filters"
              onClick={resetFilter}
              size="md"
              color="white"
              _hover={{ bg: "perygonPink" }}
              display="flex"
              alignItems="center"
              gap={[0, 0, 2]}
              lineHeight={0}
            >
              <Clear />
              <Text>{resetFiltersButtonText}</Text>
            </Button>

            {(createNewUrl || isModalEnabled) && (
              <Button
                variant="solid"
                bg="lightGreen"
                aria-label="create-new"
                onClick={handleCreateNewClick}
                size="md"
                color="white"
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <Add />
                <Text>{finalCreateNewUrlButtonText}</Text>
              </Button>
            )}
          </Flex>
        </Flex>
      )}

      <Flex direction="column" height={height}>
        <style jsx global>{`
          .ag-theme-alpine .ag-header,
          .ag-theme-alpine .ag-row,
          .ag-theme-alpine .ag-cell,
          .ag-theme-alpine .ag-root-wrapper,
          .ag-theme-alpine .ag-body-viewport {
            border: none !important;
          }
          .ag-theme-alpine .ag-header {
            background-color: transparent !important;
          }
          .ag-theme-alpine .ag-row:nth-child(odd) {
            background-color: #ffffff !important;
          }
          .ag-theme-alpine .ag-row:nth-child(even) {
            background-color: #eef2f7 !important;
          }
        `}</style>
        <AgGridReact
          ref={gridRef}
          loading={loading}
          rowData={displayedData}
          columnDefs={fields}
          rowBuffer={25}
          pagination={false}
          defaultColDef={defaultColDef}
          noRowsOverlayComponent={NoDataOverlayPink}
          loadingOverlayComponent={LoadingOverlayPink}
          onFirstDataRendered={handleGridReady}
          onFilterChanged={handleFilterChanged}
          onRowClicked={
            handleRowClick
              ? (params) => handleRowClick(params.data as T)
              : undefined
          }
        />

        <CustomGridBottomPaginationLight
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={pageSize}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onChangePageSize={handlePageSizeChange}
        />
      </Flex>

      {isModalEnabled && ModalComponent && (
        <ModalComponent isOpen={isOpen} onClose={onClose} />
      )}
    </Box>
  );
}

export const NoDataOverlayPink: React.FC = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={20}
      px={5}
      width="100%"
      height="100%"
      borderRadius="md"
    >
      <VStack spacing={4}>
        <Icon as={QueryStats} boxSize={20} color="perygonPink" />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="perygonPink"
          fontFamily="heading"
        >
          No Data Available
        </Text>
        <Text
          fontSize="lg"
          color="perygonPink"
          textAlign="center"
          fontFamily="body"
        >
          It looks like there is nothing to display at the moment.
        </Text>
      </VStack>
    </Flex>
  );
};

export default DataGridComponentLight;
