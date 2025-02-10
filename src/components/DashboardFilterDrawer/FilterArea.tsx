import React, {useState, useEffect} from "react";
import {
    Flex,
    Text,
    Button,
    useTheme,
    Box,
    Checkbox,
    VStack,
    Fade,
    Slide
} from "@chakra-ui/react";
import {format, parseISO} from "date-fns"
import {Clear, Close, FilterAlt} from "@mui/icons-material";
import {useFetchClient} from "@/hooks/useFetchClient";

import DateFilter from "@/components/DashboardFilterDrawer/DateFilterComponent";
import {DateRangeMode, ModeValueMap} from "@/components/DashboardFilterDrawer/dateRangeUtils";

interface Site {
    id: number;
    siteName: string;
}

interface Department {
    id: number;
    name: string;
}

interface SiteResponse {
    resource: Site[];
}

interface DepartmentResponse {
    resource: Department[];
}

interface FilterAreaProps {
    onApplyFilters: (postBody: Record<string, any>) => void;
    filterOptions?: {
        showDateFilter?: boolean;
        showSitesFilter?: boolean;
        showDepartmentsFilter?: boolean;
    };
    dateFilterMode?: DateRangeMode;
    defaultDateFilter?: string;
}

const FilterArea: React.FC<FilterAreaProps> = ({
                                                   onApplyFilters,
                                                   filterOptions = {
                                                       showDateFilter: true,
                                                       showSitesFilter: true,
                                                       showDepartmentsFilter: true
                                                   },
                                                   dateFilterMode = "monthly",
                                                   defaultDateFilter
                                               }) => {
    const theme = useTheme();
    const {fetchClient} = useFetchClient();

    const [isOpen, setIsOpen] = useState(false);

    const [sites, setSites] = useState<Site[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [selectedSites, setSelectedSites] = useState<number[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
    const [clearSignal, setClearsignal] = useState(0);

    useEffect(() => {
        if (!filterOptions.showSitesFilter) return;
        (async () => {
            try {
                const response = await fetchClient<SiteResponse>(
                    "/api/site/allBy?selectColumns=id,siteName",
                    {method: "GET", redirectOnError: false}
                );
                if (response && response.resource) setSites(response.resource);
            } catch (error) {
                console.error("Error fetching sites:", error);
            }
        })();
    }, [filterOptions.showSitesFilter]);

    useEffect(() => {
        if (!filterOptions.showDepartmentsFilter) return;
        (async () => {
            try {
                const response = await fetchClient<DepartmentResponse>(
                    "/api/userTeam/allBy?selectColumns=id,name&parentTeamId=null",
                    {method: "GET", redirectOnError: false}
                );
                if (response && response.resource) setDepartments(response.resource);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        })();
    }, [filterOptions.showDepartmentsFilter]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleSiteChange = (siteId: number) => {
        setSelectedSites((prev) =>
            prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
        );
    };

    const handleDepartmentChange = (deptId: number) => {
        setSelectedDepartments((prev) =>
            prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
        );
    };

    const clearAllFilters = () => {
        setDateRange(null);
        setSelectedSites([]);
        setSelectedDepartments([]);

        setClearsignal((prev) => prev + 1);
    };


    const handleApplyFilters = () => {
        const postBody: Record<string, any> = {};

        if (dateRange) {
            postBody.startDate = dateRange.startDate;
            postBody.endDate = dateRange.endDate;
        }

        if (selectedSites.length > 0) postBody.siteIds = selectedSites;
        if (selectedDepartments.length > 0) postBody.departmentIds = selectedDepartments;

        onApplyFilters(postBody);
        setIsOpen(false);
    };

    return (
        <>
            {!isOpen && (
                <Box
                    position="absolute"
                    top={[82, null, 88]}
                    right={[3, 4, 5]}
                    zIndex={1}
                    display={["flex"]}
                    alignItems="center"
                    justifyContent="center"
                    color={"rgba(248,248,248,0.8)"}
                    borderRadius="full"
                    w={["30px", "30px", "36px"]}
                    h={["30px", "30px", "36px"]}
                    backgroundColor={"rgba(255,255,255,0.2)"}
                    border="1px solid white"
                    p={1}
                    transform="scale(1)"
                    transition="transform 0.2s ease-in-out"
                    _hover={{transform: "scale(1.2)"}}
                >
                    <FilterAlt
                        onClick={() => setIsOpen(true)}
                        cursor="pointer"
                    />
                </Box>
            )}

            {isOpen && (
                <Fade in={isOpen}>
                    <Box
                        position={"fixed"}
                        zIndex={98}
                        bg={'rgba(0,0,0,0.5)'}
                        height={'100svh'}
                        width={'100svw'}
                        top={0}
                        left={0}
                    />
                </Fade>
            )}

            <Slide direction={"right"} in={isOpen} style={{zIndex: 99}}>
                <Flex
                    position="fixed"
                    flexDirection="column"
                    top={0}
                    right={0}
                    px={2}
                    pb={[24, 6]}
                    gap={3}
                    height="100%"
                    w={225}
                    boxShadow="xl"
                    bg="white"
                    pt="60px"
                    overflowY="auto"
                    css={{
                        "@media (max-width: 768px)": {
                            scrollbarWidth: "none",
                            "-ms-overflow-style": "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        },
                    }}
                >
                    {/* Panel Header */}
                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        zIndex={2}
                        backgroundColor={"white"}
                        w="full"
                        color={theme.colors.perygonPink}
                        fontWeight="bold"
                        pl={3}
                        fontSize="1.2rem"
                        position={'sticky'}
                        top={0}
                    >
                        <Text>Filter Options</Text>
                        <Close
                            style={{cursor: "pointer"}}
                            onClick={() => setIsOpen(false)}
                        />
                    </Flex>

                    {/* Date Filter (only if enabled) */}
                    {filterOptions.showDateFilter && (
                        <Box px={2}>
                            <DateFilter
                                filterMode={dateFilterMode}
                                defaultDateFilter={defaultDateFilter as ModeValueMap[typeof dateFilterMode]}
                                onDateChange={(start, end) => {
                                    if (!start || !end) {
                                        setDateRange(null);
                                    } else {
                                        setDateRange({startDate: start, endDate: end});
                                    }
                                }}
                                clearSignal={clearSignal}
                            />
                        </Box>
                    )}

                    <Box px={2} fontSize={'sm'} w={'full'}>
                        <Text fontWeight="bold">Selected Date Range:</Text>
                        <Flex justify={'space-between'} w={'full'}>
                            <Text>
                                <strong>Start</strong>:
                            </Text>
                            <Text>
                                {dateRange && format(parseISO(dateRange.startDate), "EE, dd-MM-yyyy")}
                            </Text>
                        </Flex>
                        <Flex justify={'space-between'} w={'full'}>
                            <Text>
                                <strong>End</strong>:
                            </Text>
                            <Text>
                                {dateRange && format(parseISO(dateRange.endDate), "EE, dd-MM-yyyy")}
                            </Text>
                        </Flex>
                    </Box>

                    {/* Clear Filters */}
                    <Button
                        width="100%"
                        minH={'40px'}
                        variant="red"
                        onClick={clearAllFilters}
                        leftIcon={<Clear component="svg"/>}
                    >
                        Clear Filters
                    </Button>

                    {/* Apply Filters */}
                    <Button
                        width="100%"
                        minH={'40px'}
                        variant="green"
                        onClick={handleApplyFilters}
                        _hover={{bg: theme.colors.perygonPinkDark}}
                    >
                        Apply Filters
                    </Button>

                    {/* Sites Filter */}
                    {filterOptions.showSitesFilter && (
                        <Box
                            border="1px solid"
                            borderColor={theme.colors.perygonPink}
                            borderRadius="md"
                            p={2}
                            fontSize={['14px', '16px']}
                            boxShadow="lg"
                        >
                            <Box
                                width="100%"
                                display="flex"
                                justifyContent="center"
                            >
                                <Text
                                    fontWeight="bold"
                                    mb={2}
                                    bg={theme.colors.perygonPink}
                                    color="white"
                                    width="100%"
                                    p={2}
                                    fontSize={['14px', '16px']}
                                    borderRadius="md"
                                >
                                    Sites
                                </Text>
                            </Box>
                            <VStack align="start" spacing={2}>
                                {sites.map((site) => (
                                    <Checkbox
                                        key={site.id}
                                        size={['sm', 'md']}
                                        isChecked={selectedSites.includes(site.id)}
                                        onChange={() => handleSiteChange(site.id)}
                                    >
                                        {site.siteName}
                                    </Checkbox>
                                ))}
                            </VStack>
                        </Box>
                    )}

                    {/* Departments Filter */}
                    {filterOptions.showDepartmentsFilter && (
                        <Box
                            border="1px solid"
                            borderColor={theme.colors.perygonPink}
                            borderRadius="md"
                            p={2}
                            fontSize={['14px', '16px']}
                            boxShadow="lg"
                        >
                            <Box
                                width="100%"
                                display="flex"
                                justifyContent="center"
                            >
                                <Text
                                    fontWeight="bold"
                                    mb={2}
                                    bg={theme.colors.perygonPink}
                                    color="white"
                                    width="100%"
                                    p={2}
                                    fontSize={['14px', '16px']}
                                    borderRadius="md"
                                >
                                    Departments
                                </Text>
                            </Box>
                            <VStack align="start" spacing={2}>
                                {departments.map((dept) => (
                                    <Checkbox
                                        key={dept.id}
                                        size={['sm', 'md']}
                                        isChecked={selectedDepartments.includes(dept.id)}
                                        onChange={() => handleDepartmentChange(dept.id)}
                                    >
                                        {dept.name}
                                    </Checkbox>
                                ))}
                            </VStack>
                        </Box>
                    )}
                </Flex>
            </Slide>
        </>
    );
};

export default FilterArea;
