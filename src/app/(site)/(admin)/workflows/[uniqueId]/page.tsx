import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {workflowJson} from "@/components/surveyjs/forms/workflows";
import {WorkflowDetailsBanner} from "@/components/AdminDetailsBanners/WorkflowDetailsBanner";
import {checkUserRole} from "@/lib/dal";

export default async function WorkflowsDetailPage({
                                                      params,
                                                  }: {
    params: { uniqueId: string };
}) {
    await checkUserRole(`/workflows/${params.uniqueId}`);

    const res = await apiClient(`/workflow/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const workflow = await res.json();
    const workflowData = workflow.resource;

    return (
        <>
            <WorkflowDetailsBanner workflow={workflowData}/>
            <SurveyComponent
                surveyJson={workflowJson}
                endpoint={`/workflow/${params.uniqueId}`}
                isNew={false}
                dataset={workflowData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
