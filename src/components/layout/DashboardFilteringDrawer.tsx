"use client";

import {
  Box,
  VStack,
  useTheme,
  Text,
  Checkbox,
  Button,
  Select,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { Close, Menu } from "@mui/icons-material";
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
  drawerState: "closed" | "fully-open";
  setDrawerState: (state: "closed" | "fully-open") => void;
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
}: RightHandNavigationDrawerProps) {
  const theme = useTheme();
  const MotionBox = motion(Box);

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
          top={78}
          right={5}
          zIndex={1}
          display={["none", "none", "flex"]}
          alignItems="center"
          justifyContent="center"
          color={"rgba(248,248,248,0.8)"}
          borderRadius="full"
          aspectRatio={1}
          w="36px"
          h="36px"
          backgroundColor={"rgba(255,255,255,0.2)"}
          border="1px solid white"
          p={1}
          transform="scale(1)"
          transition="transform 0.2s ease-in-out"
          _hover={{ transform: "scale(1.2)" }}
        >
          <Menu
            onClick={toggleDrawer}
            cursor="pointer"
            style={{ fontSize: "1.5rem" }}
          />
        </Box>
      )}

      <MotionBox
        display={["none", "none", "block"]}
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
            justifyContent={"flex-end"}
            gap={2}
            pr={2}
            position={"absolute"}
            right={0}
            zIndex={2}
            background={"white"}
            w={"full"}
          >
            <Box
              color={theme.colors.perygonPink}
              onClick={() => setDrawerState("closed")}
              m={0}
              p={0}
              zIndex={1}
            >
              <Close
                style={{
                  fontSize: "1.4rem",
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
                >
                  Clear All Filters
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
                      </Box>
                    ))}
                </VStack>
              </Box>
            </>
          )}
        </VStack>
      </MotionBox>
    </>
  );
});
