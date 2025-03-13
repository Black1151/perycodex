"use client";

import React, { useCallback, useEffect, useState } from "react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { WorkflowStage } from "@/app/(site)/(apps)/happiness-score/workflow/[workflowInstanceId]/page";
import { useFetchClient } from "@/hooks/useFetchClient";
import { ViewTimeline as ViewTimelineIcon } from "@mui/icons-material";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { useRouter } from "next/navigation";
import WorkflowSidebar from "@/components/Sidebars/WorkflowSidebar/WorkflowSidebar";

interface WorkflowLayoutProps {
  stages: WorkflowStage[];
  layout: "default" | "happiness" | "enps" | "client-satisfaction";
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

const REDIRECT_PATHS: Record<string, string> = {
  happiness: "/happiness-score",
  enps: "/enps",
  "client-satisfaction": "/client-satisfaction",
  default: "/",
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
  } = useWorkflow();

  const router = useRouter();
  const { fetchClient } = useFetchClient();

  const [currentStage, setCurrentStage] = useState<WorkflowStage | null>(null);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<any | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        orderedStages.find((stage) => stage.stageStatus === "Next") || null,
      );
    }
  }, [stages]);

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

        const [formDataResource, formDataset] = await Promise.all([
          formDataRequest,
          formDatasetRequest,
        ]);

        setCurrentForm(formDataResource || null);

        if (formDataset) {
          const parsedResponse =
            typeof formDataset.jsonResponse === "string"
              ? JSON.parse(formDataset.jsonResponse)
              : formDataset.jsonResponse;
          setFormData(parsedResponse);

          const isAuthorized =
            formDataset.createdBy === user?.userId ||
            formDataset.startedBy === user?.userId ||
            formDataset.startedBy === user?.userId ||
            formDataset.createdBy === 0 ||
            formDataset.startedBy === 0 ||
            user?.role === "CA";

          if (!isAuthorized) {
            setIsModalOpen(true);
            return;
          }

          if (
            (formDataset.statusId === 1 || formDataset.statusId === 2) &&
            isAuthorized
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

  return (
    <>
      {/* Modal to block access */}
      <SurveyModal
        isOpen={isModalOpen}
        onConfirm={() => router.push("/")}
        onClose={() => router.push("/")}
        showButtons={{
          close: false,
          confirm: true,
        }}
        title="Unauthorised Access"
        bodyContent="You are not authorized to view this workflow."
        confirmLabel="OK"
        cancelLabel="Cancel"
      />

      {/* Render main content only if modal is not open */}
      {!isModalOpen && (
        <>
          <WorkflowSidebar
            workflowStages={stages}
            title={"Stages"}
            drawerState={"fully-open"}
            side={"left"}
            openButtonIcon={ViewTimelineIcon}
            onStageChange={handleStageChange}
          />

          {currentStage && currentForm && (
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
              layout={layout}
              redirectUrl={redirectUrl}
              jsPath={currentStage.jsAdditionalFileUrl}
              cssPath={currentStage.cssThemeFileUrl}
              sjsPath={currentStage.sjsThemeFileUrl}
              layoutOptions={{ showTitle: true }}
            />
          )}
        </>
      )}
    </>
  );
}
