import MainPageServer from "@/components/scaffold/pages/MainPageServer";
import RiskManagementClientInner from "./RiskManagementClientInner";

export default async function Home({
                                       searchParams,
                                   }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const toolId = searchParams.toolId as string;
    const workflowId = searchParams.workflowId as string;

    return (
        <MainPageServer
            searchParams={searchParams}
            toolId={toolId}
            workflowId={workflowId}
            ClientInnerComponent={RiskManagementClientInner}
        />
    );
}
