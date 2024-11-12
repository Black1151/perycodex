import MainPageServer from "@/components/scaffold/pages/MainPageServer";
import HappinessScoreClientInner from "../happiness-score/HappinessScoreClientInner";
import BusinessScoreClientInner from "./BusinessScoreClientInner";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const toolId = searchParams.toolId as string;
  const workflowId = searchParams.wfId as string;

  return (
    <MainPageServer
      searchParams={searchParams}
      toolId={toolId}
      workflowId={workflowId}
      ClientInnerComponent={BusinessScoreClientInner}
    />
  );
}
