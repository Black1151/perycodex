import MainPageServer from "@/components/scaffold/pages/MainPageServer";
import HappinessScoreClientInner from "./HappinessScoreClientInner";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";
import { Box } from "@chakra-ui/react";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";

interface WorkflowInstanceResponse {
  resource: {
    new_wfinstid: string;
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;
  const action = searchParams.a as string;

  if (action && parseInt(action) === 1) {
    const response = await apiClient(`/startWorkflow`, {
      method: "POST",
      body: JSON.stringify({
        p_wfid: workflowId,
        p_toolid: toolId,
      }),
    });

    if (response.ok) {
      const responseData: WorkflowInstanceResponse = await response.json();
      console.log("Response data", responseData);
      if (responseData?.resource.new_wfinstid) {
        return redirect(
          `happiness-score/workflow/${responseData.resource.new_wfinstid}`,
        );
      }
    }
  } else {
    return (
      <WorkflowEngine toolId={toolId} workflowId={workflowId}>
        <MainPageServer
          searchParams={searchParams}
          toolId={toolId}
          workflowId={workflowId}
          ClientInnerComponent={HappinessScoreClientInner}
        />
      </WorkflowEngine>
    );
  }
}
