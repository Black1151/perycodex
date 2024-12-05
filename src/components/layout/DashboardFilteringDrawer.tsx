"use client";

import React, { memo, useRef, useEffect } from "react";
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
import { Clear, Close, FilterAlt, Refresh } from "@mui/icons-material";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/ManagerDashboard";

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
  drawerState: "closed" | "fully-open";
  setDrawerState: (state: "closed" | "fully-open") => void;
  isUpdating: boolean;
  refreshPage: () => void;
}

const displayNameMappings: { [key: string]: string } = {
  "Contract Type Name": "Contract Type",
  "Dept Name": "Department",
  "Job Level Name": "Job Level",
};

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
  refreshPage,
}: RightHandNavigationDrawerProps) {
  const theme = useTheme();
  const MotionBox = motion(Box);
  const iconFontSize = useBreakpointValue({ base: "1.3rem", lg: "1.5rem" });

  const drawerRef = useRef<HTMLDivElement>(null); // Create a ref for the drawer

  const toggleDrawer = () => {
    if (drawerState === "fully-open") {
      setDrawerState("closed");
    } else {
      setDrawerState("fully-open");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerState === "fully-open" &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerState("closed");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerState, setDrawerState]);

  return (
    <>
      {drawerState === "closed" && (
        <Box
          position="absolute"
          top={[136, null, 84]}
          right={[3, 4, 5]}
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
          <FilterAlt
            onClick={toggleDrawer}
            cursor="pointer"
            style={{ fontSize: iconFontSize }}
          />
        </Box>
      )}

      <MotionBox
        ref={drawerRef} // Assign the ref to the MotionBox
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
        pb={[20, null, 0]}
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
                    <option
                      key={week}
                      value={week}
                      style={{ paddingLeft: "10px" }}
                    >
                      {week}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box
                flex={1}
                position="relative"
                zIndex={1}
                px={4}
                p={3}
                overflowY="auto"
              >
                <VStack spacing={4} align="stretch" width="100%">
                  <Button
                    width="100%"
                    variant="red"
                    onClick={clearAllFilters}
                    isDisabled={isUpdating}
                    leftIcon={<Clear component="svg" />}
                  >
                    {isUpdating ? <Spinner size="sm" /> : "Clear Filters"}
                  </Button>
                  <Button
                    width="100%"
                    variant="green"
                    onClick={refreshPage}
                    leftIcon={<Refresh component="svg" />}
                  >
                    {isUpdating ? <Spinner size="sm" /> : "Refresh Data"}
                  </Button>
                </VStack>

                <VStack spacing={4} align="stretch" width="100%" mt={4}>
                  {filterOptions &&
                    filterOptions.map((group, groupIndex) => {
                      const hasOptions = group.options.length > 0;
                      if (!hasOptions) return null;
                      return (
                        <Box
                          key={group.label}
                          border="1px solid"
                          borderColor={theme.colors.perygonPink}
                          borderRadius="md"
                          p={2}
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
                              borderRadius="md"
                            >
                              {displayNameMappings[group.label] || group.label}
                            </Text>
                          </Box>
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
                                    e.target.checked
                                  )
                                }
                              >
                                {option.label}
                              </Checkbox>
                            </VStack>
                          ))}
                        </Box>
                      );
                    })}
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
