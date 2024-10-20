import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {ToolDetailsBanner} from "@/components/AdminDetailsBanners/ToolDetailsBanner";
import {toolsJson} from "@/components/surveyjs/forms/tools";

export default async function ToolsDetailPage({
                                                  params,
                                              }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/tools/${params.uniqueId}`);

    const res = await apiClient(`/tool/findConfigBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const tool = await res.json();
    const toolData = tool.resource;

    return (
        <>
            <ToolDetailsBanner tool={toolData}/>
            <SurveyComponent
                surveyJson={toolsJson}
                endpoint={`/toolConfig/${params.uniqueId}`}
                isNew={false}
                dataset={toolData}
                layout={'default'}
                sjsPath={'admin'}
            />
        </>
    );
}
