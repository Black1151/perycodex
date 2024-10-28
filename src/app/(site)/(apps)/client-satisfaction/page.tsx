import MainPageServer from "@/components/scaffold/pages/MainPageServer";
import ClientSatisfactionClientInner from "./ClientSatisfactionClientInner";

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
      ClientInnerComponent={ClientSatisfactionClientInner}
    />
  );
}
