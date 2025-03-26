"use client";

import React, { useCallback, useEffect, useState } from "react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { WorkflowStage } from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import { useFetchClient } from "@/hooks/useFetchClient";
import {
  ViewTimeline as ViewTimelineIcon,
  CheckCircle,
} from "@mui/icons-material";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { useRouter } from "next/navigation";
import WorkflowSidebar from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";
import { SubmissionResponse, SurveyLayoutType } from "@/types/surveyJs";
import { signOut } from "next-auth/react";
import LockIcon from "@mui/icons-material/Lock";

interface WorkflowLayoutProps {
  stages: WorkflowStage[];
  layout: SurveyLayoutType;
  workflowInstanceId: string | null;
}

interface Form {
  id: number;
  name: string;
  description: string;
  jsonFile: string | Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface FormDataResponse {
  id: number;
  businessProcessId: number;
  workflowInstanceId: number;
  customerId: number;
  currentStartByDefaultState: boolean;
  startDate?: string;
  completeDate?: string;
  stepName?: string;
  jsonResponse?: Record<string, any>;
  statusId?: number;
  saveAllowed?: boolean;
  uniqueId: string;
  startedBy?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  statusName: string;
}

interface Variables {
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  fieldName: string;
  fieldValue: string;
  dataType: string;
  createdAt: string;
}

const REDIRECT_PATHS: Record<string, string> = {
  happiness: "/happiness-score",
  enps: "/enps",
  "client-satisfaction": "/client-satisfaction",
  default: "/",
  tester: "/tester",
};

export default function WorkflowLayout({
  stages,
  layout,
  workflowInstanceId,
}: WorkflowLayoutProps) {
  const { user } = useUser();
  const {
    toolId,
    setToolId,
    workflowId,
    setWorkflowId,
    setCurrentWorkflowInstanceId,
    setCurrentBusinessProcessInstanceId,
    currentStage,
    setCurrentStage,
  } = useWorkflow();

  const router = useRouter();
  const { fetchClient } = useFetchClient();

  const [lastSubmissionResponse, setLastSubmissionResponse] =
    useState<SubmissionResponse | null>(null);
  const [activeStageId, setActiveStageId] = useState<number | null>(null);
  const [isAuthorised, setIsAuthorised] = useState<boolean>(false);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<any | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [workflowVariables, setWorkflowVariables] = useState<
    | Array<{
        [key: string]: { [nestedKey: string]: any };
      }>
    | undefined
  >(undefined);

  const handleStageChange = useCallback(
    async (newStage: WorkflowStage) => {
      setCurrentStage(newStage);
    },
    [fetchClient],
  );

  useEffect(() => {
    setCurrentWorkflowInstanceId(workflowInstanceId);

    return () => {
      setCurrentWorkflowInstanceId(null);
      setCurrentBusinessProcessInstanceId(null);
    };
  }, []);

  useEffect(() => {
    if (stages.length === 1) {
      setCurrentStage(stages[0]);
    } else if (stages.length > 1) {
      const orderedStages = stages.sort((a, b) => a.bpOrder - b.bpOrder);
      setCurrentStage(
        orderedStages.find((stage) => stage.stageStatus === "Next") ||
          orderedStages.find((stage) => stage.stageStatus === "In Progress") ||
          orderedStages[0],
      );
    }
  }, [stages]);

  useEffect(() => {
    const code = lastSubmissionResponse?.data?.code;

    // BP and whole workflow is now complete
    if (code === 4 && stages.length > 1) {
      setIsCompleteModalOpen(true);
    }

    // BP Instance is now complete
    if (code === 3) {
      // do nothing really... already affected by it going to the next stage
    }

    // BP is already complete and can't be completed again
    if (code === 2) {
      // maybe: show a toast saying "Already completed"
    }

    // User not found or BP Instance doesn't exist
    if (code === -1 || code === 1) {
      // maybe: show an error or warning
    }
  }, [lastSubmissionResponse]);

  useEffect(() => {
    const fetchStageData = async () => {
      if (!currentStage) return;

      setCurrentBusinessProcessInstanceId(String(currentStage.bpInstId));
      setToolId(String(currentStage.wfInstTool));
      setWorkflowId(String(currentStage.wfId));

      try {
        const formDataRequest = currentStage.formId
          ? fetchClient<Form>(`/api/workflows/getForm`, {
              method: "POST",
              body: { formId: currentStage.formId },
              redirectOnError: false,
            })
          : Promise.resolve(null);

        const formDatasetRequest = currentStage.bpInstId
          ? fetchClient<FormDataResponse>(`/api/workflows/getFormData`, {
              method: "POST",
              body: { businessProcessInstanceId: currentStage.bpInstId },
              redirectOnError: false,
            })
          : Promise.resolve(null);

        const variablesRequest = workflowInstanceId
          ? fetchClient<Variables[]>("/api/workflows/getVariables", {
              method: "POST",
              body: {
                workflowInstanceId: workflowInstanceId,
              },
              redirectOnError: false,
            })
          : Promise.resolve(null);

        const [formDataResource, formDataset, variablesResponse] =
          await Promise.all([
            formDataRequest,
            formDatasetRequest,
            variablesRequest,
          ]);

        setCurrentForm(formDataResource || null);
        setActiveStageId(currentStage.bpInstBpId);

        if (variablesResponse) {
          const processedVariables: Array<{ [key: string]: any }> = [];

          variablesResponse.forEach((variable) => {
            let parsedValue: any = variable.fieldValue;

            try {
              switch (variable.dataType.toLowerCase()) {
                case "number":
                  parsedValue = parseFloat(variable.fieldValue);
                  if (isNaN(parsedValue)) {
                    parsedValue = variable.fieldValue;
                  }
                  break;
                case "boolean":
                  parsedValue =
                    variable.fieldValue.toLowerCase() === "true"
                      ? true
                      : variable.fieldValue.toLowerCase() === "false"
                        ? false
                        : variable.fieldValue;
                  break;
                case "json":
                  parsedValue = JSON.parse(variable.fieldValue);
                  break;
                case "date":
                  parsedValue = new Date(variable.fieldValue);
                  if (isNaN(parsedValue.getTime())) {
                    parsedValue = variable.fieldValue;
                  }
                  break;
                default:
                  break;
              }
            } catch (error) {
              console.error(
                `Error parsing value for ${variable.fieldName}:`,
                error,
              );
              parsedValue = variable.fieldValue;
            }

            if (typeof parsedValue === "object" && parsedValue !== null) {
              processedVariables.push({ [variable.fieldName]: parsedValue });
            } else {
              processedVariables.push({ [variable.fieldName]: parsedValue });
            }
          });

          setWorkflowVariables(processedVariables);
        } else {
          setWorkflowVariables(undefined);
        }

        if (formDataset) {
          const parsedResponse =
            typeof formDataset.jsonResponse === "string"
              ? JSON.parse(formDataset.jsonResponse)
              : formDataset.jsonResponse;
          setFormData(parsedResponse);

          const isUserAuthorised = (() => {
            // Definitive order of events

            // You should never be able to click a stage if it is pending
            if (currentStage.stageStatus === "Pending") {
              return false;
            }

            // A CA should be able to click into everything regardless if it has been completed or next
            if (
              user &&
              user.role === "CA" &&
              (currentStage.stageStatus === "Next" ||
                currentStage.stageStatus === "Complete")
            ) {
              return true;
            }

            // An EU should only be allowed if the stage isExternalBusinessProcess = true
            if (user && user.role === "EU") {
              return currentStage.isExternalBusinessProcess;
            }

            // Optional order of events
            const internalIsUserAuthorised = true;

            // Check if the user is the creator or started the process
            if (
              formDataset.createdBy === user?.userId ||
              formDataset.startedBy === user?.userId ||
              formDataset.createdBy === 0 || // 0 may indicate public access
              formDataset.startedBy === 0
            ) {
              return true;
            }

            // Checking the logic around the Global Variables
            if (
              // If stage is locked (bound by the GV as not startByDefault) and there is no isGlobalVariableBlocking
              currentStage.stageStatus === "Locked"
            ) {
              return false;
            }

            // If there is a UAG a user should be part of that group to be able to access it
            if (
              currentStage.userAccessGroupNames &&
              currentStage.userAccessGroupNames.length > 0
            ) {
              if (!user) {
                return false;
              }

              if (!user?.groupNames?.length) {
                return false;
              }

              const hasAccess = currentStage.userAccessGroupNames.some(
                (groupName) => user?.groupNames?.includes(groupName) ?? false,
              );

              if (!hasAccess) {
                return false;
              }
            }

            // If no restrictions apply, authorize by default
            return internalIsUserAuthorised;
          })();

          setIsAuthorised(isUserAuthorised);

          if (!isUserAuthorised) {
            setIsModalOpen(true);
            return;
          }

          if (currentStage.allowAlwaysEdit && isUserAuthorised) {
            setIsNew(true);
          } else if (
            (formDataset.statusId === 1 || formDataset.statusId === 2) &&
            isUserAuthorised
          ) {
            setIsNew(true);
          } else if (formDataset.statusId === 3) {
            setIsNew(false);
          }
        }
      } finally {
      }
    };
    fetchStageData();
  }, [currentStage]);

  const redirectPath = REDIRECT_PATHS[layout] || REDIRECT_PATHS.default;
  const redirectUrl = `${redirectPath}?wfId=${workflowId}&toolId=${toolId}`;

  const allExternalStagesComplete =
    user?.role === "EU" &&
    stages
      .filter((stage) => stage.isExternalBusinessProcess)
      .every((stage) => stage.stageStatus === "Complete");

  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    await signOut({ redirect: false });
    router.push("/login");
  };

  const onSuccess = () => {
    if (stages.length > 1) {
      router.refresh();
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <>
      <SurveyModal
        isOpen={isModalOpen}
        onConfirm={
          allExternalStagesComplete && user?.role === "EU"
            ? handleLogout
            : () => setIsModalOpen(false)
        }
        onClose={() =>
          allExternalStagesComplete && user?.role === "EU"
            ? handleLogout()
            : router.push("/")
        }
        showButtons={{
          close: false,
          confirm: true,
        }}
        title={
          allExternalStagesComplete && user?.role === "EU" ? (
            <Flex
              justify={"space-between"}
              align={"center"}
              flexDirection={"column"}
              gap={2}
            >
              <Icon as={CheckCircle} boxSize={8} color={"green.500"} />
              <Text>Thank you for completing everything </Text>
            </Flex>
          ) : (
            <Flex
              justify={"space-between"}
              align={"center"}
              flexDirection={"column"}
              gap={2}
            >
              <Icon as={LockIcon} boxSize={8} color={"red.500"} />
              <Text>Unauthorised Access</Text>
            </Flex>
          )
        }
        bodyContent={
          allExternalStagesComplete && user?.role === "EU" ? (
            <Flex align="center" flexDirection={"column"} gap={3}>
              <Text>You’ve completed all required steps.</Text>
              <Text>You will now be logged out.</Text>
            </Flex>
          ) : (
            <Flex align="center" flexDirection={"column"} gap={3}>
              <Text>You are not authorized to view this stage.</Text>
              <Text>Please select one in the sidebar to the left</Text>
            </Flex>
          )
        }
        confirmLabel={
          allExternalStagesComplete && user?.role === "EU" ? "Logout" : "OK"
        }
        cancelLabel="Cancel"
      />

      <SurveyModal
        isOpen={isCompleteModalOpen}
        onConfirm={() => router.push(redirectUrl)}
        onClose={() => setIsCompleteModalOpen(false)}
        showButtons={{
          close: true,
          confirm: true,
        }}
        title={
          <Flex
            justify={"space-between"}
            align={"center"}
            flexDirection={"column"}
            gap={2}
          >
            <Icon as={CheckCircle} boxSize={8} color={"green.500"} />
            <Text>All Done!</Text>
          </Flex>
        }
        bodyContent={
          <Flex align="center" flexDirection={"column"} gap={3}>
            <Text>You’ve completed all required steps.</Text>
            <Text>Finish will return you to your dashboards</Text>
          </Flex>
        }
        confirmLabel="Finish"
        cancelLabel="Cancel"
      />

      <WorkflowSidebar
        workflowStages={stages}
        currentStageId={activeStageId}
        title={"Stages"}
        drawerState={"fully-open"}
        side={"left"}
        openButtonIcon={ViewTimelineIcon}
        onStageChange={handleStageChange}
      />

      {!isModalOpen && isAuthorised && currentStage && currentForm && (
        <SurveyComponent
          surveyJson={
            typeof currentForm.jsonFile === "string"
              ? JSON.parse(currentForm.jsonFile)
              : currentForm.jsonFile
          }
          endpoint={`/api/workflows/saveWorkflow/${currentStage.bpInstId}`}
          isNew={isNew}
          dataset={formData}
          formSubmission="workflow"
          onSurveySuccess={onSuccess}
          layout={currentStage.layout ?? layout}
          jsPath={currentStage.jsAdditionalFileUrl}
          cssPath={currentStage.cssThemeFileUrl}
          sjsPath={currentStage.sjsThemeFileUrl}
          layoutOptions={{
            showTitle: true,
            saveAllowed: currentStage.saveAllowed,
            allowAlwaysEdit: currentStage.allowAlwaysEdit,
          }}
          includeVariables={workflowVariables}
          onSubmissionResponse={setLastSubmissionResponse}
        />
      )}
    </>
  );
}
