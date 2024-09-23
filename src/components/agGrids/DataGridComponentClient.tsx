'use client';

// React and Next.js
import React, {useRef, useCallback, useState, useMemo, useEffect} from 'react';
import {useRouter} from 'next/navigation';

// Import AG Grids
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-charts-enterprise";
import {LicenseManager} from "ag-grid-charts-enterprise";

// AG Grids Theming
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import NoDataOverlay from "@/components/agGrids/NoDataOverlay";
import CustomGridBottomPagination from "@/components/agGrids/CustomGridBottomPagination";

// Icons
import {Add} from "@mui/icons-material"

// Chakra Elements
import {Box, Button, Flex, Input, useBreakpointValue} from '@chakra-ui/react';
import {RxCross2} from "react-icons/rx";


interface DataGridComponentClientProps<T> {
    endpoint: string;
    initialFields: string[];
    createNewUrl?: string | null;
}

LicenseManager.setLicenseKey(`${process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY}`);

const DataGridComponentClient = <T, >({
                                          endpoint,
                                          initialFields,
                                          createNewUrl,
                                      }: DataGridComponentClientProps<T>) => {
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState<T[]>([]);
    const [fields, setFields] = useState<any[]>(initialFields);
    const router = useRouter();
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result = await response.json();

                console.log(result);
                setRowData(result.resource); // Update state with the fetched data
            } catch (err) {
                console.error(err)
                // setError(err.message); // Handle errors
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Call the proxy API
    }, []);


    // Memoize defaultColDef to avoid re-renders
    const defaultColDef = useMemo(() => ({
        flex: isMobile ? 0 : 1,
        sortable: true,
        filter: true,
        floatingFilter: false,
        resizable: true,
        autoSizeStrategy: {
            type: 'fitCellContents'
        },
    }), [isMobile]);

    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRows: 0,
        pageSize: 25
    });


    // Memoize updatePaginationInfo to avoid re-renders
    const updatePaginationInfo = useCallback(() => {
        if (gridRef.current?.api) {
            setPaginationInfo({
                currentPage: gridRef.current.api.paginationGetCurrentPage() + 1,
                totalPages: gridRef.current.api.paginationGetTotalPages(),
                pageSize: gridRef.current.api.paginationGetPageSize(),
                totalRows: gridRef.current.api.paginationGetRowCount(),
            });
        }
    }, []);

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

    const createNewUrlButtonText = useBreakpointValue({base: '', sm: '', md: 'Create New'});
    const resetFiltersButtonText = useBreakpointValue({base: '', sm: '', md: 'Reset Filters'});

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box className={`ag-theme-alpine`} w={'full'} bg={'white'} p={2}>
            {rowData ?
                <>
                    <Flex w={'full'} justify={'flex-start'} align={'center'} mb={2} gap={2}>
                        {/* Quick Filter */}
                        <Input
                            variant="text_box"
                            id="filter-text-box"
                            placeholder="Search..."
                            onInput={onFilterTextBoxChanged}
                            w={256}
                        />

                        <Button
                            variant="solid"
                            colorScheme="red"
                            aria-label='reset-filters'
                            onClick={resetFilter}
                            ml={'auto'}
                            size="md"
                            _hover={{bg: "red.500"}}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <RxCross2 style={{marginRight: resetFiltersButtonText ? '8px' : '0'}}/>
                            {resetFiltersButtonText}
                        </Button>


                        {createNewUrl &&
                            <Button
                                variant='solid'
                                colorScheme="teal"
                                aria-label={`create-new`}
                                onClick={() => router.push(createNewUrl)}
                                size="md"
                                _hover={{bg: "teal.500"}}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Add style={{marginRight: createNewUrlButtonText ? '8px' : '0'}}/>
                                {createNewUrlButtonText}
                            </Button>
                        }
                    </Flex>
                    <Flex direction={'column'} height={'500px'}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={fields}
                            pagination={true}
                            suppressPaginationPanel={true}
                            onPaginationChanged={updatePaginationInfo}
                            defaultColDef={defaultColDef}
                            paginationPageSize={paginationInfo.pageSize}
                        />
                        <CustomGridBottomPagination
                            gridRef={gridRef}
                            paginationInfo={paginationInfo}
                            onPageChange={updatePaginationInfo}
                        />
                    </Flex>
                </>
                :
                <NoDataOverlay url={createNewUrl}/>
            }
        </Box>
    );
};

export default DataGridComponentClient;
