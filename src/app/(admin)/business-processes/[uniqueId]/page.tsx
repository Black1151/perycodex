import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {businessProcessJson} from "@/components/surveyjs/forms/businessProcess";
import {BusinessProcessDetailsBanner} from "@/components/AdminDetailsBanners/BusinessProcessDetailsBanner";

export default async function BusinessProcessesDetailPage({
                                                      params,
                                                  }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/business-processes/${params.uniqueId}`);

    const res = await apiClient(`/businessProcess/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const businessProcess = await res.json();
    const businessProcessData = businessProcess.resource;

    return (
        <>
            <BusinessProcessDetailsBanner businessProcess={businessProcessData}/>
            <SurveyComponent
                surveyJson={businessProcessJson}
                endpoint={`/businessProcess/${params.uniqueId}`}
                isNew={false}
                dataset={businessProcessData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
