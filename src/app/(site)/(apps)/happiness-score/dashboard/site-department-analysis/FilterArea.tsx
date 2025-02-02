import React, {useState, useEffect} from "react";
import {
    Flex,
    Select,
    Text,
    Button,
    useTheme,
    Box,
    Checkbox,
    VStack,
    Fade,
    Slide
} from "@chakra-ui/react";
import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears,
    format,
} from "date-fns";
import {Clear, Close, FilterAlt, FilterList} from "@mui/icons-material";
import {useFetchClient} from "@/hooks/useFetchClient";

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
    resource: Department[]
}

interface FilterAreaProps {
    onApplyFilters: (postBody: Record<string, any>) => void;
    filterOptions?: {
        showDateFilter?: boolean;
        showSitesFilter?: boolean;
        showDepartmentsFilter?: boolean;
    }
    defaultDateFilter?: string;
}

const FilterArea: React.FC<FilterAreaProps> = ({
                                                   onApplyFilters,
                                                   filterOptions = {
                                                       showDateFilter: true,
                                                       showSitesFilter: true,
                                                       showDepartmentsFilter: true
                                                   },
                                                   defaultDateFilter
                                               }) => {
        const theme = useTheme();
        const {fetchClient} = useFetchClient();

        const [isOpen, setIsOpen] = useState(false);
        const [selectedSites, setSelectedSites] = useState<number[]>([]);
        const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
        const [sites, setSites] = useState<Site[]>([]);
        const [departments, setDepartments] = useState<Department[]>([]);
        const [dateFilter, setDateFilter] = useState<string>(defaultDateFilter || "");


        const dateRanges = [
            {
                name: "Current Week",
                value: "currentWeek",
                getRange: () => [startOfWeek(new Date(), {weekStartsOn: 1}), endOfWeek(new Date(), {weekStartsOn: 1})]
            },
            {
                name: "Previous Week",
                value: "previousWeek",
                getRange: () => [startOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1}), endOfWeek(subWeeks(new Date(), 1), {weekStartsOn: 1})]
            },
            {
                name: "Current Month",
                value: "currentMonth",
                getRange: () => [startOfMonth(new Date()), endOfMonth(new Date())]
            },
            {
                name: "Previous Month",
                value: "previousMonth",
                getRange: () => [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]
            },
            {
                name: "Last 3 Months",
                value: "last3Months",
                getRange: () => [startOfMonth(subMonths(new Date(), 2)), endOfMonth(new Date())]
            },
            {
                name: "Last 6 Months",
                value: "last6Months",
                getRange: () => [startOfMonth(subMonths(new Date(), 5)), endOfMonth(new Date())]
            },
            {
                name: "Last 9 Months",
                value: "last9Months",
                getRange: () => [startOfMonth(subMonths(new Date(), 8)), endOfMonth(new Date())]
            },
            {
                name: "Last 12 Months",
                value: "last12Months",
                getRange: () => [startOfMonth(subMonths(new Date(), 11)), endOfMonth(new Date())]
            },
            {name: "Current Year", value: "currentYear", getRange: () => [startOfYear(new Date()), endOfYear(new Date())]},
            {
                name: "Previous Year", value: "previousYear", getRange: () => {
                    const lastYearDate = subYears(new Date(), 1);
                    return [startOfYear(lastYearDate), endOfYear(lastYearDate)];
                }
            },
            {
                name: "Last 2 Years",
                value: "last2Years",
                getRange: () => [startOfYear(subYears(new Date(), 1)), endOfYear(new Date())]
            },
        ];

        useEffect(() => {
            if (!filterOptions.showSitesFilter) return;
            (async () => {
                try {
                    const response = await fetchClient<SiteResponse>("/api/site/allBy?selectColumns=id,siteName", {
                        method: "GET",
                        redirectOnError: false
                    });
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
                    const response = await fetchClient<DepartmentResponse>("/api/userTeam/allBy?selectColumns=id,name&parentTeamId=null", {
                        method: "GET",
                        redirectOnError: false
                    });
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
            // Cleanup: Reset overflow on unmount or whenever isOpen changes
            return () => {
                document.body.style.overflow = "auto";
            };
        }, [isOpen]);

        const handleSiteChange = (siteId: number) => {
            setSelectedSites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]));
        };

        const handleDepartmentChange = (deptId: number) => {
            setSelectedDepartments((prev) => (prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]));
        };

        const clearAllFilters = () => {
            setDateFilter(defaultDateFilter || "");
            setSelectedSites([]);
            setSelectedDepartments([]);
        };

        const handleApplyFilters = () => {
            let postBody: Record<string, any> = {};

            const selectedRange = dateRanges.find((range) => range.value === dateFilter);
            if (selectedRange) {
                const [startDate, endDate] = selectedRange.getRange();
                postBody.startDate = format(startDate, "yyyy-MM-dd");
                postBody.endDate = format(endDate, "yyyy-MM-dd");
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
                        top={[76, null, 95]}
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

                {/* Filter Area */}
                    <Fade in={isOpen}>
                        <Box position={"fixed"} zIndex={98} bg={'rgba(0,0,0,0.5)'} height={'100svh'} width={'100svw'}
                             top={0}
                             left={0}>
                        </Box>
                    </Fade>
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
                            {/* Header */}
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
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setIsOpen(false)}
                                />
                            </Flex>


                            {filterOptions.showDateFilter && (
                                <Select
                                    placeholder="All (no date filter)"
                                    value={dateFilter}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setDateFilter(e.target.value)
                                    }
                                    w="full"
                                >
                                    {dateRanges.map((range) => (
                                        <option key={range.value} value={range.value}>
                                            {range.name}
                                        </option>
                                    ))}
                                </Select>
                            )}
                            <Button
                                width="100%"
                                minH={'40px'}
                                variant="red"
                                onClick={clearAllFilters}
                                leftIcon={<Clear component="svg"/>}
                            >
                                Clear Filters
                            </Button>

                            {/* Apply Filter Button */}
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
                                <Box border="1px solid"
                                     borderColor={theme.colors.perygonPink}
                                     borderRadius="md"
                                     p={2}
                                     fontSize={['14px', '16px']}
                                     boxShadow="lg">
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


                                <Box border="1px solid"
                                     borderColor={theme.colors.perygonPink}
                                     borderRadius="md"
                                     p={2}
                                     fontSize={['14px', '16px']}
                                     boxShadow="lg">
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
    }
;

export default FilterArea;
