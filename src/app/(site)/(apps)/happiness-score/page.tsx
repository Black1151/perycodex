import MainPageServer from "@/components/scaffold/pages/MainPageServer";
import HappinessScoreClientInner from "./HappinessScoreClientInner";
import WorkflowEngine from "@/app/(site)/(apps)/WorkflowEngine";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;

  return (
    <WorkflowEngine toolId={toolId}>
      <MainPageServer
        searchParams={searchParams}
        toolId={toolId}
        workflowId={workflowId}
        ClientInnerComponent={HappinessScoreClientInner}
      />
    </WorkflowEngine>
  );
}
