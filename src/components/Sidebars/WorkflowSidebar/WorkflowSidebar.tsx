"use client";

import React, { useMemo, useState } from "react";
import Sidebar, { SidebarProps } from "@/components/Sidebars/Sidebar";
import { Box, VStack, HStack, Text, useTheme, Icon } from "@chakra-ui/react";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "@/providers/UserProvider";
import { DrawerStateOptions } from "@/components/Sidebars/useDrawerState";
import { SurveyLayoutType } from "@/types/surveyJs";

interface WorkflowSidebarProps extends SidebarProps {
  workflowStages: WorkflowStage[];
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
}

interface EnhancedWorkflowStage extends WorkflowStage {
  canClick: boolean;
  canSee: boolean;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  workflowStages,
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
    let canClick: boolean = false;

    if (stage.stageStatus === "Pending") {
      return false;
    }

    if (user && user.role === "EU" && stage.isExternalBusinessProcess) {
      return true;
    }

    // User Roles
    if (user && user.role === "CA") {
      return true;
    }

    if (user && user.groupNames) {
      user.groupNames.forEach((name) => {
        if (stage.userAccessGroupNames != null) {
          if (stage?.userAccessGroupNames.includes(name)) {
            canClick = true;
          }
        }
      });
    }

    return canClick;
  };

  // Should the stage be visible to the user?
  const canSeeStage = (stage: WorkflowStage): boolean => {
    let canSee: boolean = false;

    if (stage.stageStatus === "Pending") {
      return false;
    }

    // User Roles for EU
    if (user && user.role === "EU" && stage.isExternalBusinessProcess) {
      return true;
    }

    // User Roles for CA
    if (user && user.role === "CA") {
      return true;
    }

    // User Access Group
    if (user && user.groupNames) {
      user.groupNames.forEach((name) => {
        if (stage.userAccessGroupNames != null) {
          if (stage?.userAccessGroupNames.includes(name)) {
            canSee = true;
          }
        }
      });
    }

    return canSee;
  };

  // Build the stages for the sidebar
  const enhancedStages: EnhancedWorkflowStage[] = useMemo(() => {
    return workflowStages.map((stage) => {
      return {
        ...stage,
        canClick: canClickStage(stage),
        canSee: canSeeStage(stage),
      };
    });
  }, [workflowStages]);

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
              !stage.canSee
                ? "gray.300"
                : stage.canClick
                  ? theme.colors.perygonPink
                  : theme.colors.green
            }
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
              color={
                stage.canSee
                  ? stage.canClick
                    ? "green.500"
                    : "blue.500"
                  : "gray.500"
              }
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
              <HStack spacing={1}>
                <VisibilityIcon fontSize="small" />
                {stage.canSee ? (
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
