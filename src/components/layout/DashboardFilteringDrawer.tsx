"use client";

import {
  Box,
  Button,
  Checkbox,
  Select,
  Spinner,
  Text,
  useBreakpointValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { BlurOn, Close } from "@mui/icons-material";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/ManagerDashboard";

interface RightHandNavigationDrawerProps {
  title?: string;
  handleCheckboxChange: (
    groupIndex: number,
    optionIndex: number,
    isChecked: boolean,
  ) => void;
  filterOptions: FilterOptionGroup[];
  clearAllFilters: () => void;
  weekOptions: string[];
  selectedWeek: string | null;
  onWeekChange: (week: string) => void;
  drawerState: "closed" | "fully-open";
  setDrawerState: (state: "closed" | "fully-open") => void;
  isUpdating: boolean; // Added prop
}

export const DashboardFilteringDrawer = memo(function DashboardFilteringDrawer({
  handleCheckboxChange,
  filterOptions,
  title,
  clearAllFilters,
  weekOptions,
  selectedWeek,
  onWeekChange,
  drawerState,
  setDrawerState,
  isUpdating,
}: RightHandNavigationDrawerProps) {
  const theme = useTheme();
  const MotionBox = motion(Box);
  const iconFontSize = useBreakpointValue({ base: "1.3rem", lg: "1.5rem" });

  const toggleDrawer = () => {
    if (drawerState === "fully-open") {
      setDrawerState("closed");
    } else {
      setDrawerState("fully-open");
    }
  };

  return (
    <>
      {drawerState === "closed" && (
        <Box
          position="absolute"
          top={[74, 74, 78]}
          right={[4, 4, 5]}
          zIndex={1}
          display={["flex"]}
          alignItems="center"
          justifyContent="center"
          color={"rgba(248,248,248,0.8)"}
          borderRadius="full"
          aspectRatio={1}
          w={["30px", "30px", "36px"]}
          h={["30px", "30px", "36px"]}
          backgroundColor={"rgba(255,255,255,0.2)"}
          border="1px solid white"
          p={1}
          transform="scale(1)"
          transition="transform 0.2s ease-in-out"
          _hover={{ transform: "scale(1.2)" }}
        >
          <BlurOn
            onClick={toggleDrawer}
            cursor="pointer"
            style={{ fontSize: iconFontSize }}
          />
        </Box>
      )}

      <MotionBox
        display={"block"}
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={225}
        zIndex={5}
        bg="white"
        boxShadow="xl"
        transform={
          drawerState === "fully-open" ? "translateX(0)" : "translateX(100%)"
        }
      >
        <VStack align="stretch" height="100%" pt={"60px"}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent={"space-between"}
            gap={2}
            pr={2}
            position={"absolute"}
            right={0}
            zIndex={2}
            background={"white"}
            w={"full"}
            pl={5}
            color={theme.colors.perygonPink}
            fontWeight={"bold"}
            fontSize={"1.2rem"}
          >
            Filter Options
            <Box onClick={() => setDrawerState("closed")} zIndex={1} pt={1}>
              <Close
                style={{
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
          {drawerState === "fully-open" && title && (
            <Box px={4}>
              <Text style={{ color: theme.colors.perygonPink }}>{title}</Text>
            </Box>
          )}

          {drawerState === "fully-open" && (
            <>
              <Box px={4} mt={4}>
                <Select
                  placeholder="Select Week"
                  value={selectedWeek || ""}
                  onChange={(e) => onWeekChange(e.target.value)}
                  isDisabled={isUpdating}
                >
                  {weekOptions.map((week) => (
                    <option key={week} value={week}>
                      {week}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box
                flex={1}
                position="relative"
                zIndex={1}
                p={4}
                overflowY="auto"
              >
                <Button
                  colorScheme="pink"
                  size="sm"
                  width="100%"
                  onClick={clearAllFilters}
                  isDisabled={isUpdating}
                >
                  {isUpdating ? <Spinner size="sm" /> : "Clear All Filters"}
                </Button>
                <VStack spacing={4} align="stretch" width="100%" mt={4}>
                  {filterOptions &&
                    filterOptions.map((group, groupIndex) => (
                      <Box key={group.label}>
                        <Text fontWeight="bold" mb={2}>
                          {group.label}
                        </Text>
                        {group.options.map((option, optionIndex) => (
                          <VStack align="start" key={option.value}>
                            <Checkbox
                              isChecked={option.isSelected}
                              isDisabled={
                                isUpdating ||
                                (!option.isSelected && option.isDisabled)
                              }
                              onChange={(e) =>
                                handleCheckboxChange(
                                  groupIndex,
                                  optionIndex,
                                  e.target.checked,
                                )
                              }
                            >
                              {option.label}
                            </Checkbox>
                          </VStack>
                        ))}
                      </Box>
                    ))}
                </VStack>
              </Box>
              {isUpdating && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(255, 255, 255, 0.6)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  zIndex={10}
                >
                  <Spinner size="lg" />
                </Box>
              )}
            </>
          )}
        </VStack>
      </MotionBox>
    </>
  );
});
