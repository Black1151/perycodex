import React from 'react';
import {Box, Flex} from "@chakra-ui/react";
import {SectionHeader} from "@/components/sectionHeader/SectionHeader";
import {AgCharts} from "ag-charts-react";

const AgChartComponent = ({flex, title, chartOptions}: {
    flex: string,
    title: string,
    chartOptions: any
}) => {
    return (
        <Box flex={flex}>
            <Flex width="100%" justifyContent="center" align="center" mb={4}>
                <SectionHeader>{title}</SectionHeader>
            </Flex>
            <Box borderRadius="2xl" shadow="xl" overflow="hidden" height="500px">
                <AgCharts
                    options={chartOptions as any}
                    style={{width: "100%", height: "100%"}}
                />
            </Box>
        </Box>
    );
};

export default AgChartComponent;