"use client";

import {
  Box,
  VStack,
  useTheme,
  Text,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Select,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/page";

interface RightHandNavigationDrawerProps {
  title?: string;
  handleCheckboxChange: (
    groupIndex: number,
    optionIndex: number,
    isChecked: boolean
  ) => void;
  filterOptions: FilterOptionGroup[];
  clearAllFilters: () => void;
  weekOptions: string[];
  selectedWeek: string | null;
  onWeekChange: (week: string) => void;
  timeRangeOptions: string[];
  selectedTimeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
}

export const DashboardFilteringDrawer = memo(function DashboardFilteringDrawer({
  handleCheckboxChange,
  filterOptions,
  title,
  clearAllFilters,
  weekOptions,
  selectedWeek,
  onWeekChange,
}: RightHandNavigationDrawerProps) {
  const theme = useTheme();

  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      bottom={0}
      width={225}
      zIndex={5}
      bg="white"
      boxShadow="xl"
      display={["none", "none", "block"]}
    >
      <VStack align="stretch" height="100%" pt={"60px"}>
        {/* Drawer Title */}
        {title && (
          <Box px={4}>
            <Text style={{ color: theme.colors.perygonPink }}>{title}</Text>
          </Box>
        )}

        {/* Week Selector */}
        <Box px={4} mt={4}>
          <Select
            placeholder="Select Week"
            value={selectedWeek || ""}
            onChange={(e) => onWeekChange(e.target.value)}
          >
            {weekOptions.map((week) => (
              <option key={week} value={week}>
                {week}
              </option>
            ))}
          </Select>
        </Box>
        {/* Drawer Content */}
        <Box flex={1} position="relative" zIndex={1} p={4} overflowY="auto">
          <Button
            colorScheme="pink"
            size="sm"
            width="100%"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
          <VStack spacing={4} align="stretch" width="100%" mt={4}>
            {filterOptions &&
              filterOptions.map((group, groupIndex) => (
                <Accordion key={group.label} allowToggle>
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {group.label}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {group.options.map((option, optionIndex) => (
                        <VStack align="start" key={option.value}>
                          <Checkbox
                            isChecked={option.isSelected}
                            isDisabled={option.isDisabled}
                            onChange={(e) =>
                              handleCheckboxChange(
                                groupIndex,
                                optionIndex,
                                e.target.checked
                              )
                            }
                          >
                            {option.label}
                          </Checkbox>
                        </VStack>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
});
