"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Sidebar, { SidebarProps } from "@/components/Sidebars/Sidebar";
import {
  Box,
  VStack,
  Text,
  useTheme,
  Icon,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LockIcon from "@mui/icons-material/Lock";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { useUser } from "@/providers/UserProvider";
import { DrawerStateOptions } from "@/components/Sidebars/useDrawerState";
import { SurveyLayoutType } from "@/types/surveyJs";

interface WorkflowSidebarProps extends SidebarProps {
  workflowStages: WorkflowStage[];
  currentStageId: number | null;
  onStageChange: (stage: WorkflowStage) => void;
}

type StageStatus = "Next" | "Pending" | "Complete" | "Locked";

export interface WorkflowStage {
  wfInstId: number;
  wfInstCustomer: number;
  wfInstCreatedBy: number;
  wfInstStatus: number;
  wfInstTool: number;
  wfId: number;
  wfName: string;
  bpId: number;
  bpName: string;
  bpOrder: number;
  formId: number;
  jsAdditionalFileUrl: string;
  cssThemeFileUrl: string;
  sjsThemeFileUrl: string;
  largeIconImageUrl: string | null;
  smallIconImageUrl: string | null;
  userAccessGroupNames: string[] | null;
  startByDefault: boolean;
  minRequired: number;
  maxRequired: number;
  anonSubmission: boolean;
  headerLogo?: string;
  headerText?: string;
  layout: SurveyLayoutType | null;
  bpInstId: number;
  bpInstBpId: number;
  bpInstCustomer: number;
  bpInstCreatedBy: number;
  bpInstStartdDate: string | null;
  bpInstStatus: number;
  stageStatus: string;
  userGroupRestriction: boolean;
  wouldHaveBeenNextIfNotLocked: boolean;
  isExternalBusinessProcess: boolean;
  isGlobalVariableBlocking: boolean | null;
}

interface EnhancedWorkflowStage extends WorkflowStage {
  canClick: boolean;
  active: boolean;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  workflowStages,
  currentStageId,
  onStageChange,
  ...sidebarProps
}) => {
  const theme = useTheme();
  const { user } = useUser();

  // Handle Sidebar state
  const [drawerState, setDrawerState] = useState<DrawerStateOptions>(
    sidebarProps.drawerState,
  );
  const canHalf = true;
  const canFull = true;

  const onOpen = () => {
    if (canHalf) setDrawerState("half-open");
    else setDrawerState("fully-open");
  };

  const onToggle = () => {
    setDrawerState((curr) =>
      curr === "half-open" ? "fully-open" : "half-open",
    );
  };

  const onClose = () => {
    setDrawerState("closed");
  };

  // Dictates if the user is allowed to click on the stage
  const canClickStage = (stage: WorkflowStage): boolean => {
    // Definitive order of events

    // You should never be able to click a stage if it is pending
    if (stage.stageStatus === "Pending") {
      return false;
    }

    // A CA should be able to click into everything regardless if it has been completed or next
    if (
      user &&
      user.role === "CA" &&
      (stage.stageStatus === "Next" || stage.stageStatus === "Complete")
    ) {
      return true;
    }

    // An EU should only be allowed if the stage isExternalBusinessProcess = true
    if (user && user.role === "EU") {
      return stage.isExternalBusinessProcess;
    }

    // Optional order of events
    let canClick: boolean = true;

    // Checking the logic around the Global Variables
    if (
      // If stage is locked (bound by the GV as not startByDefault) and there is no isGlobalVariableBlocking
      stage.stageStatus === "Locked"
    ) {
      return false;
    }

    // If there is a UAG a user should be part of that group to be able to access it
    if (stage.userAccessGroupNames && stage.userAccessGroupNames.length > 0) {
      if (!user) {
        return false;
      }

      if (!user?.groupNames?.length) {
        return false;
      }

      const hasAccess = stage.userAccessGroupNames.some(
        (groupName) => user?.groupNames?.includes(groupName) ?? false,
      );

      if (!hasAccess) {
        return false;
      }
    }

    return canClick;
  };

  const userHasAccessGroupAccess = (stage: WorkflowStage) => {
    if (stage.userAccessGroupNames && stage.userAccessGroupNames.length > 0) {
      if (!user || !user.groupNames?.length) {
        return false;
      }

      return stage.userAccessGroupNames.some((groupName) =>
        user?.groupNames?.includes(groupName),
      );
    }

    // If no access groups are defined, it's accessible to all
    return true;
  };

  const [enhancedStages, setEnhancedStages] = useState<EnhancedWorkflowStage[]>(
    workflowStages.map((stage) => ({
      ...stage,
      canClick: canClickStage(stage),
      active: stage.bpInstBpId === currentStageId,
    })),
  );

  useEffect(() => {
    setEnhancedStages(
      workflowStages.map((stage) => ({
        ...stage,
        canClick: canClickStage(stage),
        active: stage.bpInstBpId === currentStageId,
      })),
    );
  }, [workflowStages, currentStageId]);

  const handleClick = (stage: EnhancedWorkflowStage) => {
    if (stage.canClick) {
      onStageChange(stage);
    }
  };

  const isStageStatus = (value: string): value is StageStatus => {
    return ["Next", "Complete", "Locked", "Pending"].includes(value);
  };

  const getIconForStage = (stage: EnhancedWorkflowStage, full: boolean) => {
    const boxSize = stage.active && full ? 6 : 4;

    if (stage.stageStatus === "Pending") {
      if (user?.role === "EU" && stage.isExternalBusinessProcess) {
        return (
          <Icon
            as={CheckCircleOutlineIcon}
            boxSize={boxSize}
            color={"blue.500"}
          />
        );
      }
      return !userHasAccessGroupAccess(stage) ? (
        <Icon as={LockIcon} boxSize={boxSize} color={"red.500"} />
      ) : (
        <Icon
          as={CheckCircleOutlineIcon}
          boxSize={boxSize}
          color={"blue.500"}
        />
      );
    }

    if (stage.stageStatus === "Next") {
      if (user?.role === "EU" && stage.isExternalBusinessProcess) {
        return (
          <Icon
            as={ArrowCircleRightOutlinedIcon}
            boxSize={boxSize}
            color={"green.500"}
          />
        );
      }

      return !userHasAccessGroupAccess(stage) ? (
        <Icon as={LockIcon} boxSize={boxSize} color={"red.500"} />
      ) : (
        <Icon
          as={ArrowCircleRightOutlinedIcon}
          boxSize={boxSize}
          color={"green.500"}
        />
      );
    }

    const iconsByStatus: Record<StageStatus, ReactElement> = {
      Next: (
        <Icon
          as={ArrowCircleRightOutlinedIcon}
          boxSize={boxSize}
          color={"green.500"}
        />
      ),
      Complete: (
        <Icon as={CheckCircleIcon} boxSize={boxSize} color={"green.500"} />
      ),
      Locked: <Icon as={LockIcon} boxSize={boxSize} color={"red.500"} />,
      Pending: (
        <Icon
          as={CheckCircleOutlineIcon}
          boxSize={boxSize}
          color={"blue.500"}
        />
      ),
    };

    if (isStageStatus(stage.stageStatus)) {
      return iconsByStatus[stage.stageStatus];
    }

    return <Icon as={HelpOutlineIcon} boxSize={boxSize} color={"gray.500"} />;
  };

  const fullBarMenu = (
    <VStack align="stretch" spacing={2} p={2}>
      {enhancedStages
        .sort((a, b) => a.bpOrder - b.bpOrder)
        .map((stage) => (
          <Flex
            key={stage.bpInstId}
            fontSize={16}
            p={3}
            gap={2}
            border={stage.active ? "3px solid" : "1px solid"}
            borderColor={stage.active ? "green.500" : "black"}
            bg={"transparent"}
            color={"black"}
            alignItems="center"
            flexDirection={"column"}
            position="relative"
            overflow="hidden"
            borderRadius="md"
            cursor={stage.canClick ? "pointer" : "not-allowed"}
            _hover={{
              bg: stage.canClick ? "gray.100" : "transparent",
            }}
            onClick={() => handleClick(stage)}
          >
            <Box
              boxSize={"18px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <WidgetsIcon />
            </Box>
            <Text flex={1} zIndex={2} textAlign={"center"}>
              {stage.bpName}
            </Text>
            <Flex gap={2} justify={"space-between"} align={"center"} w={"full"}>
              <Text
                fontWeight={stage.active ? "bold" : undefined}
                fontSize={"sm"}
                color={
                  stage.stageStatus === "Complete" ||
                  stage.stageStatus === "Next"
                    ? "green.500"
                    : "blue.500"
                }
              >
                {stage.stageStatus}
              </Text>
              {getIconForStage(stage, true)}
            </Flex>
          </Flex>
        ))}
    </VStack>
  );

  const halfBarMenu = (
    <VStack align="stretch" spacing={4} mt={2}>
      {enhancedStages
        .sort((a, b) => a.bpOrder - b.bpOrder)
        .map((stage) => (
          <Tooltip
            key={stage.bpInstId}
            hasArrow
            label={stage.bpName}
            placement={"right"}
          >
            <Box
              fontSize={16}
              p={2}
              gap={2}
              border={stage.active ? "3px solid" : "1px solid"}
              borderColor={stage.active ? "green.500" : "black"}
              bg={"transparent"}
              color={"black"}
              borderRadius="md"
              cursor={stage.canClick ? "pointer" : "not-allowed"}
              _hover={{
                bg: stage.canClick ? "gray.100" : "transparent",
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => handleClick(stage)}
              position={"relative"}
              boxSizing={"border-box"}
            >
              {" "}
              <WidgetsIcon />
              <Box
                position="absolute"
                top={0}
                right={0}
                transform="translate(30%,-30%)"
                bg="white"
                borderRadius="full"
                border={"0.5px solid black"}
                boxSize="24px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="sm"
                zIndex={1}
              >
                {getIconForStage(stage, false)}
              </Box>
            </Box>
          </Tooltip>
        ))}
    </VStack>
  );

  return (
    <Sidebar
      {...sidebarProps}
      drawerState={drawerState}
      canHalf={canHalf}
      canFull={canFull}
      onOpen={onOpen}
      onToggle={onToggle}
      onClose={onClose}
      fullyOpenContent={fullBarMenu}
      halfOpenContent={halfBarMenu}
    />
  );
};

export default WorkflowSidebar;
