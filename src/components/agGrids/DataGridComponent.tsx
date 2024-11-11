"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {useRouter} from 'next/navigation';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-charts-enterprise';
import {LicenseManager} from 'ag-grid-charts-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    Box,
    Button,
    Flex,
    Input,
    useBreakpointValue,
    useDisclosure
} from '@chakra-ui/react';
import {Add, Clear} from '@mui/icons-material';
import NoDataOverlay from '@/components/agGrids/NoDataOverlay';
import CustomGridBottomPagination from '@/components/agGrids/CustomGridBottomPagination';
import LoadingOverlay from "@/components/agGrids/LoadingOverlay";
import {ColDef} from "ag-grid-community";

interface DataGridComponentProps<T> {
    data: T[] | null;
    initialFields: ColDef[];
    createNewUrl?: string;
    createNewUrlButtonText?: string;
    isModalEnabled?: boolean;
    openModalComponent?: React.ElementType; // Pass the modal component as a React component type
}

// Define the type for pagination info
interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalRows: number;
    pageSize: number;
}

LicenseManager.setLicenseKey(`${process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY}`);

const DataGridComponent = <T, >({
                                    data,
                                    initialFields,
                                    createNewUrl,
                                    createNewUrlButtonText,
                                    isModalEnabled,
                                    openModalComponent: ModalComponent, // Accept the component directly as a React element type
                                }: DataGridComponentProps<T>) => {
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState<T[]>(data || []);
    const [fields, setFields] = useState<any[]>(initialFields);
    const router = useRouter();
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});

    // Modal disclosure state for Chakra UI
    const {isOpen, onOpen, onClose} = useDisclosure();

    // Memoize defaultColDef to avoid re-renders
    const defaultColDef = useMemo(() => ({
        flex: isMobile ? 0 : 1,
        sortable: true,
        filter: true,
        floatingFilter: false,
        resizable: true,
    }), [isMobile]);

    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRows: 0,
        pageSize: 25,
    });

    // General function to update pagination info for both grids
    const updatePaginationInfo = useCallback(
        (gridRef: React.RefObject<AgGridReact<any>>, setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>) => {
            if (gridRef.current?.api) {
                setPaginationInfo({
                    currentPage: gridRef.current.api.paginationGetCurrentPage() + 1,
                    totalPages: gridRef.current.api.paginationGetTotalPages(),
                    pageSize: gridRef.current.api.paginationGetPageSize(),
                    totalRows: gridRef.current.api.paginationGetRowCount(),
                });
            }
        },
        []
    );

    // Handle the click for creating new items
    const handleCreateNewClick = () => {
        if (isModalEnabled && ModalComponent) {
            onOpen();  // Open the modal if enabled
        } else if (createNewUrl) {
            router.push(createNewUrl); // Navigate to the URL if modal is not enabled
        }
    };

    createNewUrlButtonText = useBreakpointValue({base: '', sm: '', md: createNewUrlButtonText ?? 'Create New'});
    const resetFiltersButtonText = useBreakpointValue({base: '', sm: '', md: 'Reset Filters'});

    // Quick Filter
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current!.api.setGridOption(
            "quickFilterText",
            (document.getElementById("filter-text-box") as HTMLInputElement).value,
        );
    }, [])

    // Reset all filters and quick filter
    const resetFilter = useCallback(() => {
        gridRef.current?.api.setFilterModel(null);
        gridRef.current?.api.setGridOption('quickFilterText',
            (document.getElementById('filter-text-box') as HTMLInputElement).value = '');
    }, []);

    // Effect to update rowData when the prop `data` changes
    useEffect(() => {
        if (data) {
            setRowData(data);
        }
    }, [data]); // Run this effect whenever the data prop changes

    return (
        <Box className={`ag-theme-alpine ag-theme-perygon`} w={'full'} py={2}>
            <Flex w={'full'} justify={'flex-start'} align={'center'} my={4} gap={2}>
                {/* Quick Filter */}
                <Input
                    variant="outline"
                    id="filter-text-box"
                    placeholder="Search..."
                    onInput={onFilterTextBoxChanged}
                    w={256}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{borderColor: 'gray.400'}}
                    _focus={{borderColor: 'perygonPink', boxShadow: '0 0 0 1px #ff0070'}}
                />

                <Button
                    variant="solid"
                    bg="seduloRed"
                    aria-label="reset-filters"
                    onClick={resetFilter}
                    ml={'auto'}
                    size="md"
                    color="white"
                    leftIcon={<Clear/>}
                    _hover={{bg: 'perygonPink'}}
                >
                    {resetFiltersButtonText}
                </Button>

                {/* Create New Button */}
                {(createNewUrl || isModalEnabled) && (
                    <Button
                        variant="solid"
                        bg="lightGreen"
                        aria-label="create-new"
                        onClick={handleCreateNewClick}
                        size="md"
                        color="white"
                        leftIcon={<Add/>}
                    >
                        {createNewUrlButtonText}
                    </Button>
                )}
            </Flex>

            <Flex direction={'column'} height={'500px'}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={fields}
                    pagination={true}
                    suppressPaginationPanel={true}
                    onPaginationChanged={() => {
                        updatePaginationInfo(gridRef, setPaginationInfo)
                    }}
                    defaultColDef={defaultColDef}
                    paginationPageSize={paginationInfo.pageSize}
                    noRowsOverlayComponent={NoDataOverlay}
                    loadingOverlayComponent={LoadingOverlay}
                />
                <CustomGridBottomPagination
                    gridRef={gridRef}
                    paginationInfo={paginationInfo}
                    onPageChange={() => {
                        updatePaginationInfo(gridRef, setPaginationInfo)
                    }}
                />
            </Flex>

            {/* Render the modal component with modal state control */}
            {isModalEnabled && ModalComponent && (
                <ModalComponent isOpen={isOpen} onClose={onClose}/>
            )}
        </Box>
    );
};

export default DataGridComponent;
