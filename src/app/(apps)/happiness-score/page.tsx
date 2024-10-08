import MainPageServer from "@/components/scaffold/pages/MainPageServer";
import HappinessScoreClientInner from "./HappinessScoreClientInner";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const toolId = searchParams.toolId as string;

  return (
    <MainPageServer
      searchParams={searchParams}
      toolId={toolId}
      ClientInnerComponent={HappinessScoreClientInner}
    />
  );
}
