"use client";

import React, {useState, useEffect} from 'react';
import AgChartComponent from "@/components/agCharts/AgChartComponent";
import {Flex, VStack, useTheme} from "@chakra-ui/react";
import FilterArea from "@/app/(site)/(apps)/happiness-score/dashboard/site-department-analysis/FilterArea";
import {AgBarSeriesOptions, AgLineSeriesOptions, AgRadialGaugeOptions, AgSankeySeriesOptions} from "ag-charts-types";
import AgGaugeComponent from "@/components/agCharts/AgGaugeComponent";
import SankeyTooltipRenderer from "@/components/agCharts/SankeyTooltipRenderer";
import SubmissionsTooltipRenderer from "@/components/agCharts/SubmissionsTooltipRenderer";
import ScoreTooltipRenderer from "@/components/agCharts/ScoreTooltipRenderer";
import {useFetchClient} from "@/hooks/useFetchClient";

interface enpsMainDashboardResponse {
    resource: {
        gauge: GaugeData;
        histogram: HistogramRecord[];
        monthlyLineChart: LineDataRecord[];
        sankey: SankeyDataRecord[];
    }
}


interface GaugeData {
    minScore: number;
    maxScore: number;
    value: number;
}

interface HistogramRecord {
    value: number;
    count: number;
}

interface LineDataRecord {
    monthYear: string;
    value: number;
}

interface SankeyDataRecord {
    from: string;
    to: string;
    value: number;
}

const AllEnpsDashboard = () => {

        const [filterOptions, setFilterOptions] = useState<Record<string, any>>({});
        const theme = useTheme();
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const {fetchClient} = useFetchClient()


        const [gaugeData, setGaugeData] = useState<GaugeData>({});
        const [histogramData, setHistogramData] = useState<HistogramRecord[]>([]);
        const [lineChartData, setLineChartData] = useState<LineDataRecord[]>([]);
        const [sankeyData, setSankeyData] = useState<SankeyDataRecord[]>();


        const gaugeOptions: AgRadialGaugeOptions = {
            type: "radial-gauge",
            value: gaugeData.value,
            scale: {
                min: gaugeData.minScore,
                max: gaugeData.maxScore,
            },
        };

        const histogramOptions: AgBarSeriesOptions = {
            type: 'bar',
            series: [
                {
                    type: "bar",
                    xKey: "value",
                    yKey: "count",
                    yName: "Count of Scores",
                    cornerRadius: 10,
                    shadow: {
                        enabled: true,
                        color: "#191919",
                        xOffset: 1,
                        yOffset: 1,
                        blur: 4,
                    },
                    itemStyler: (params) => {
                        const {datum, xKey} = params;
                        const score = datum[xKey];

                        let color = '';

                        if (score < 7) {
                            color = 'red';
                        } else if (score < 9) {
                            color = theme.colors.yellow;
                        } else {
                            color = theme.colors.seduloGreen;
                        }

                        return {
                            fill: color,
                        };
                    },
                    tooltip: {
                        renderer: SubmissionsTooltipRenderer
                    }
                }
            ],
            data: histogramData
        };

        const lineChartOptions: AgLineSeriesOptions = {
            type: "line",
            data: lineChartData,
            series: [
                {
                    type: 'line',
                    yKey: 'value',

                    xKey: 'monthYear',
                    stroke: theme.colors.perygonPink,
                    interpolation: {
                        type: "smooth",
                    },
                    tooltip: {
                        renderer: ScoreTooltipRenderer
                    },
                    marker: {
                        enabled: true,
                        itemStyler: (params) => {
                            const {datum, yKey} = params;
                            const score = datum[yKey];
                            const fillColor = getColor(score);

                            return {
                                fill: fillColor,
                                size: 10,
                            };
                        },
                    },
                }
            ],
            axes: [
                {
                    type: "category",
                    position: "bottom",
                    label: {
                        rotation: 300,
                        fontSize: 12,
                        color: theme.colors.perygonPink,
                    },
                    gridLine: {
                        width: 0
                    },
                    title: {
                        text: "Month - Year",
                        fontSize: 12,
                        color: "black",
                    },
                },
                {
                    type: "number",
                    position: "left",
                    min: -100,
                    max: 100,
                    title: {
                        text: "Happiness Score",
                        fontSize: 12,
                        color: "black",
                    },
                    label: {
                        fontSize: 12,
                        color: theme.colors.perygonPink,
                    },
                },
            ],
            padding: {top: 20, left: 20, right: 20, bottom: 50},
            legend: {enabled: false},
            zoom: {enabled: false},
            navigator: {enabled: false},
            contextMenu: {enabled: false},
        };

        const sankeyOptions: AgSankeySeriesOptions = {
            type: "sankey",
            data: sankeyData,
            series: [
                {
                    type: "sankey",
                    fromKey: "from",
                    toKey: "to",
                    weightKey: "value",
                    label: {
                        fontSize: 12,
                        color: theme.colors.perygonPink,
                    },
                    node: {
                        align: 'justify',
                    },
                    link: {
                        itemStyler: (params) => {
                            // "datum" contains the link data (including `from`, `to`, `value`)
                            const {datum} = params;
                            const {from, to} = datum;

                            // Decide color based on `from` or `to` label:
                            let color = '#34495e';
                            if (to === 'Promoters') {
                                color = theme.colors.seduloGreen;
                            } else if (to === 'Detractors') {
                                color = 'red';
                            } else if (to === 'Passives') {
                                color = theme.colors.yellow;
                            } else if (to === 'Affectors') {
                                color = 'grey';
                            }


                            // Return styling for this link
                            return {
                                fill: color,
                                fillOpacity: 0.25,
                                stroke: color,
                                strokeWidth: 1,
                                strokeOpacity: 0.25,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        renderer:
                        SankeyTooltipRenderer,
                    }

                },
            ],
        };

        function safeJsonParse(str) {
            try {
                return JSON.parse(str);
            } catch (err) {
                console.error("Could not parse JSON:", err);
                return null; // or some default fallback
            }
        }


        const getData = async (postBody: Record<string, any> = filterOptions) => {
            setIsLoading(true);
            try {
                const response = await fetchClient<enpsMainDashboardResponse>(
                    "/api/enps/getEnpsMainDashboard",
                    {
                        method: "POST",
                        body: postBody,
                        redirectOnError: false,
                    },
                );

                if (response && response.resource) {
                    setGaugeData(safeJsonParse(response.resource.gauge));
                    setHistogramData(safeJsonParse(response.resource.histogram));
                    setLineChartData(safeJsonParse(response.resource.monthlyLineChart));
                    setSankeyData(safeJsonParse(response.resource.sankey));
                } else {
                    console.error("Invalid response:", response);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const onFilterChange = (postBody: Record<string, any>) => {
            setFilterOptions(postBody);
            getData(postBody);
        }

        useEffect(() => {
            getData();
        }, [])


        return (
            <VStack align="stretch" spacing={6} w="full" py={4}>
                <FilterArea onApplyFilters={onFilterChange}
                            filterOptions={{showDepartmentsFilter: false, showSitesFilter: false, showDateFilter: true}}/>
                <Flex w={"100%"} gap={6} flexWrap={"wrap"}>

                    {/* Gauge */}
                    <AgGaugeComponent flex={"1 1 45%"} title={"Gauge"}
                                      chartOptions={gaugeOptions}/>

                    {/* Histogram */}
                    <AgChartComponent flex={"1 1 45%"} title={"Histogram"}
                                      chartOptions={histogramOptions}/>

                    {/* Line Chart */}
                    <AgChartComponent flex={"1 1 45%"} title={"Line Chart"} chartOptions={lineChartOptions}/>

                    {/* Sankey */}
                    <AgChartComponent flex={"1 1 45%"} title={"Sankey"} chartOptions={sankeyOptions}/>
                </Flex>
            </VStack>
        );
    }
;

export default AllEnpsDashboard;