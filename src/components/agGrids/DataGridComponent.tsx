'use client';

// React and Next.js
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';

// Import AG Grids
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-charts-enterprise';
import {LicenseManager} from 'ag-grid-charts-enterprise';

// AG Grids Theming
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import NoDataOverlay from '@/components/agGrids/NoDataOverlay';
import CustomGridBottomPagination from '@/components/agGrids/CustomGridBottomPagination';

// Icons from MUI
import {Add, Clear} from '@mui/icons-material';

// Chakra Elements
import {
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    useBreakpointValue,
    useDisclosure
} from '@chakra-ui/react';

interface DataGridComponentProps<T> {
    data: T[] | null;
    initialFields: string[];
    createNewUrl?: string | null;
    isModalEnabled?: boolean;
    openModalComponent?: React.ReactNode;
}

LicenseManager.setLicenseKey(`${process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY}`);

const DataGridComponent = <T, >({
                                    data,
                                    initialFields,
                                    createNewUrl,
                                    isModalEnabled,
                                    openModalComponent
                                }: DataGridComponentProps<T>) => {
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState<T[]>(data || []);
    const [fields, setFields] = useState<any[]>(initialFields);
    const router = useRouter();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});

    // Memoize defaultColDef to avoid re-renders
    const defaultColDef = useMemo(
        () => ({
            flex: isMobile ? 0 : 1,
            sortable: true,
            filter: true,
            floatingFilter: false,
            resizable: true,
        }),
        [isMobile]
    );

    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRows: 0,
        pageSize: 25,
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

    const handleCreateNewClick = () => {
        if (isModalEnabled && openModalComponent) {
            onOpen();  // Open the modal if modal functionality is enabled
        } else if (createNewUrl) {
            router.push(createNewUrl);  // Navigate to the URL otherwise
        }
    };

    return (
        <Box className={`ag-theme-alpine ag-theme-perygon`} w={'full'} py={2}>
            {data ? (
                <>
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

                        {createNewUrl && (
                            <Button
                                variant="solid"
                                bg="lightGreen"
                                aria-label="create-new"
                                onClick={() => router.push(createNewUrl)}
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

                    {openModalComponent && isModalEnabled && (
                        <Modal isOpen={isOpen} onClose={onClose} size="full">
                            <ModalOverlay/>
                            <ModalContent>
                                <ModalBody>{openModalComponent}</ModalBody>
                            </ModalContent>
                        </Modal>
                    )}
                </>
            ) : (
                <NoDataOverlay url={createNewUrl}/>
            )}
        </Box>
    );
};

export default DataGridComponent;