"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar, { SidebarProps } from "@/components/Sidebars/Sidebar";
import { Box, VStack, HStack, Text, useTheme, Icon } from "@chakra-ui/react";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "@/providers/UserProvider";
import { DrawerStateOptions } from "@/components/Sidebars/useDrawerState";
import { SurveyLayoutType } from "@/types/surveyJs";

interface WorkflowSidebarProps extends SidebarProps {
  workflowStages: WorkflowStage[];
  currentStageId: number | null;
  onStageChange: (stage: WorkflowStage) => void;
}

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
  const canHalf = false;
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

    const canClick: boolean = true;

    // Checking the logic around the Global Variables
    if (
      // If stage is locked (bound by the GV as not startByDefault) and there is no isGlobalVariableBlocking
      stage.stageStatus === "Locked" &&
      stage.isGlobalVariableBlocking
    ) {
      return false;
    }

    if (
      stage.stageStatus === "Locked" &&
      stage.isGlobalVariableBlocking === false &&
      stage.wouldHaveBeenNextIfNotLocked === false
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

  const fullBarMenu = (
    <VStack align="stretch" spacing={2} p={2}>
      {enhancedStages
        .sort((a, b) => a.bpOrder - b.bpOrder)
        .map((stage) => (
          <Box
            key={stage.bpInstId}
            p={3}
            border="1px solid"
            borderColor={
              stage.active
                ? theme.colors.blue
                : stage.canClick
                  ? theme.colors.perygonPink
                  : theme.colors.green
            }
            backgroundColor={stage.active ? "blue.100" : "transparent"}
            borderRadius="md"
            cursor={stage.canClick ? "pointer" : "not-allowed"}
            _hover={{
              bg: stage.canClick ? "gray.100" : "transparent",
            }}
            onClick={() => handleClick(stage)}
          >
            <Text fontWeight="bold">{stage.bpName}</Text>
            <Text
              fontSize="sm"
              color={stage.canClick ? "green.500" : "blue.500"}
            >
              {stage.stageStatus}
            </Text>
            <HStack spacing={2} mt={2}>
              <HStack spacing={1}>
                <AdsClickIcon fontSize="small" />
                {stage.canClick ? (
                  <Icon color={"green"}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </Icon>
                ) : (
                  <Icon color={"red"}>
                    <CancelIcon color="error" fontSize="small" />
                  </Icon>
                )}
              </HStack>
            </HStack>
          </Box>
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
    />
  );
};

export default WorkflowSidebar;
