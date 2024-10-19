'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-charts-enterprise';
import {
    GetRowIdParams, GridApi,
    GridReadyEvent,
    LicenseManager,
    RowDataTransaction,
    RowDropZoneParams
} from 'ag-grid-charts-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {Box, Button, Flex, Heading, Text, useBreakpointValue} from '@chakra-ui/react';
import CustomGridBottomPagination from '@/components/agGrids/CustomGridBottomPagination';
import LoadingOverlay from '@/components/agGrids/LoadingOverlay';
import DraggableNoDataOverlay from "@/components/agGrids/DraggableNoDataOverlay";
import {useFetchClient} from "@/hooks/useFetchClient";
import {ColDef} from "ag-grid-community";


LicenseManager.setLicenseKey(`${process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY}`);

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalRows: number;
    pageSize: number;
}

interface DraggableGridsComponentProps {
    populationData: any[] | null;
    populationTitle?: string;
    sampleData: any[] | null;
    sampleTitle?: string;
    fieldDefs: ColDef[];
    dynamicIdField: string;
}

const DraggableGridsComponent: React.FC<DraggableGridsComponentProps> = ({
                                                                             populationData,
                                                                             populationTitle,
                                                                             sampleData,
                                                                             sampleTitle,
                                                                             fieldDefs,
                                                                             dynamicIdField
                                                                         }) => {
    const isMobile = useBreakpointValue({base: true, sm: true, md: false});
    const [populationRowData, setPopulationRowData] = useState<any[]>(populationData || []);
    const [sampleRowData, setSampleRowData] = useState<any[]>(sampleData || []);
    const {fetchClient, loading} = useFetchClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const checkForDuplicateIds = useCallback(() => {
        const checkDuplicates = (data: any[], idField: string) => {
            const seenIds = new Set();
            for (const item of data) {
                if (seenIds.has(item[idField])) {
                    return item[idField];
                }
                seenIds.add(item[idField]);
            }
            return null;
        };

        if (populationData && sampleData) {
            const duplicateInPopulation = checkDuplicates(populationData, dynamicIdField);
            const duplicateInSample = checkDuplicates(sampleData, dynamicIdField);

            if (duplicateInPopulation) {
                setErrorMessage(`Duplicate ID found in Population data: ${duplicateInPopulation}`);
                return true;
            }
            if (duplicateInSample) {
                setErrorMessage(`Duplicate ID found in Sample data: ${duplicateInSample}`);
                return true;
            }
        }

        setErrorMessage(null);
        return false;
    }, [populationData, sampleData, dynamicIdField]);


    useEffect(() => {
        checkForDuplicateIds();
    }, [populationData, sampleData, dynamicIdField, checkForDuplicateIds]);


    useEffect(() => {
        if (!errorMessage && populationData && sampleData) {
            const sampleIds = new Set(sampleData.map((row) => row[dynamicIdField]));
            const reducedPopulation = populationData.filter(
                (row) => !sampleIds.has(row[dynamicIdField])
            );
            setPopulationRowData(reducedPopulation);
        }
    }, [populationData, sampleData, dynamicIdField, errorMessage]);

    const populationDraggableBoxRef = useRef<HTMLDivElement>(null);
    const sampleDraggableBoxRef = useRef<HTMLDivElement>(null);
    const populationGridRef = useRef<AgGridReact>(null);
    const sampleGridRef = useRef<AgGridReact>(null);

    const commonPaginationInfo = {
        currentPage: 1,
        totalPages: 0,
        totalRows: 0,
        pageSize: 25,
    };


    const [populationPaginationInfo, setPopulationPaginationInfo] = useState<PaginationInfo>(commonPaginationInfo);
    const [samplePaginationInfo, setSamplePaginationInfo] = useState<PaginationInfo>(commonPaginationInfo);


    const defaultColDef = useMemo(() => ({
        flex: isMobile ? 0 : 1,
        sortable: true,
        filter: true,
        floatingFilter: false,
        resizable: true,
    }), [isMobile]);


    const updatePaginationInfo = useCallback(
        (gridRef: React.RefObject<AgGridReact>, setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>) => {
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


    const getRowId = (params: GetRowIdParams) => String(params.data[dynamicIdField]);

    const addRecordToGrid = (oldGridApi: GridApi, newGridApi: GridApi, data: any) => {

        if (!data || data[dynamicIdField] == null) {
            return;
        }

        const newRowApi = newGridApi;

        const rowAlreadyInGrid = !!newRowApi!.getRowNode(data[dynamicIdField]);
        let newTransaction: RowDataTransaction;

        if (rowAlreadyInGrid) {
            window.alert("Row already exists");
            return;
        }

        newTransaction = {
            add: [data],
        };

        newRowApi!.applyTransaction(newTransaction);

        const oldRowApi = oldGridApi;
        let oldTransaction: RowDataTransaction;

        oldTransaction = {
            remove: [data]
        };

        oldRowApi!.applyTransaction(oldTransaction);

    };


    const addDropZoneToGrid = useCallback(
        (
            params: GridReadyEvent,
            sourceGridRef: React.RefObject<AgGridReact>,
            targetGridRef: React.RefObject<AgGridReact>,
            targetDropZoneRef: React.RefObject<HTMLDivElement>
        ) => {
            const dropZoneContainer = targetDropZoneRef.current;

            if (!dropZoneContainer) {
                console.error("Drop zone container not found.");
                return;
            }


            if (!sourceGridRef.current?.api || !targetGridRef.current?.api) {
                console.error("Grid references are null or API is not available.");
                return;
            }

            const dropZone: RowDropZoneParams = {
                getContainer: () => dropZoneContainer,
                onDragStop: (draggedParams) => {

                    if (sourceGridRef.current?.api && targetGridRef.current?.api) {
                        addRecordToGrid(
                            sourceGridRef.current.api,
                            targetGridRef.current.api,
                            draggedParams.node.data
                        );
                    }
                },
            };


            params.api.addRowDropZone(dropZone);
        },
        [addRecordToGrid]
    );

    const handleSubmission = async () => {
        if (!sampleGridRef.current || !sampleGridRef.current.api) {
            console.error("Grid API not available");
            return;
        }


        const rowData: any[] = [];
        sampleGridRef.current.api.forEachNode((node) => rowData.push(node.data));


        const result = await fetchClient(`/api/surveyjs/test`, {
            method: "PUT",
            body: rowData,
            successMessage: "Data sent successfully.",
            errorMessage: "Unable to send data. Please try again.",
            redirectOnError: false,
        });

        if (result) {
            window.alert("YEY");
        }
    };

    return (
        <Box className="ag-theme-alpine ag-theme-perygon" w="full" py={2}>
            {!errorMessage ? (
                    <>
                        <Flex w="full" align="center" gap={8}>
                            {/* Population Grid Section */}
                            <Flex direction="column" height="500px" flexGrow={1} mr={4} ref={populationDraggableBoxRef}>
                                <Heading mb={2}>{populationTitle ?? 'Original Data'}</Heading>
                                <AgGridReact
                                    ref={populationGridRef}
                                    rowData={populationRowData}
                                    pagination
                                    suppressPaginationPanel
                                    getRowId={getRowId}
                                    onPaginationChanged={() => updatePaginationInfo(populationGridRef, setPopulationPaginationInfo)}
                                    defaultColDef={defaultColDef}
                                    paginationPageSize={populationPaginationInfo.pageSize}
                                    noRowsOverlayComponent={DraggableNoDataOverlay}
                                    noRowsOverlayComponentParams={{gridType: 'population'}}
                                    loadingOverlayComponent={LoadingOverlay}
                                    onGridReady={(params) =>
                                        addDropZoneToGrid(
                                            params,
                                            populationGridRef,
                                            sampleGridRef,
                                            sampleDraggableBoxRef
                                        )
                                    }
                                    columnDefs={fieldDefs}
                                />
                                <CustomGridBottomPagination
                                    gridRef={populationGridRef}
                                    paginationInfo={populationPaginationInfo}
                                    onPageChange={() => updatePaginationInfo(populationGridRef, setPopulationPaginationInfo)}
                                />
                            </Flex>

                            {/* Sample Grid Section */}
                            <Flex direction="column" height="500px" flexGrow={1} ref={sampleDraggableBoxRef}>
                                <Heading mb={2}>{sampleTitle ?? 'New Data'}</Heading>
                                <AgGridReact
                                    ref={sampleGridRef}
                                    rowData={sampleRowData}
                                    pagination
                                    getRowId={getRowId}
                                    suppressPaginationPanel
                                    onPaginationChanged={() => updatePaginationInfo(sampleGridRef, setSamplePaginationInfo)}
                                    defaultColDef={defaultColDef}
                                    paginationPageSize={samplePaginationInfo.pageSize}
                                    noRowsOverlayComponent={DraggableNoDataOverlay}
                                    noRowsOverlayComponentParams={{gridType: 'sample'}}
                                    loadingOverlayComponent={LoadingOverlay}
                                    onGridReady={(params) =>
                                        addDropZoneToGrid(
                                            params,
                                            sampleGridRef,
                                            populationGridRef,
                                            populationDraggableBoxRef
                                        )
                                    }
                                    columnDefs={fieldDefs}
                                />
                                <CustomGridBottomPagination
                                    gridRef={sampleGridRef}
                                    paginationInfo={samplePaginationInfo}
                                    onPageChange={() => updatePaginationInfo(sampleGridRef, setSamplePaginationInfo)}
                                />
                            </Flex>
                        </Flex>
                        <Button my={4} p={4} onClick={handleSubmission} isDisabled={!!errorMessage}>Submit</Button>
                    </>)
                :
                <Box my={4} p={4} bg="red.100" color="red.800">
                    <Text>{errorMessage}</Text>
                </Box>
            }
        </Box>
    );
};

export default DraggableGridsComponent;
