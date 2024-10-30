import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {toolSubscriptionsJson} from "@/components/surveyjs/forms/toolSubscriptions";
import {ToolSubscriptionDetailsBanner} from "@/components/AdminDetailsBanners/ToolSubscriptionDetailsBanner";

export default async function ToolSubscriptionsDetailPage({
                                                              params,
                                                          }: {
    params: { uniqueId: string };
}) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/tool-subscriptions/${params.uniqueId}`);

    const res = await apiClient(`/toolCustomer/findBy?id=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const toolSubscription = await res.json();
    const toolSubscriptionData = toolSubscription.resource;

    return (
        <>
            <ToolSubscriptionDetailsBanner toolSubscription={toolSubscriptionData}/>
            <SurveyComponent
                surveyJson={toolSubscriptionsJson}
                endpoint={`/toolCustomer/${params.uniqueId}`}
                isNew={false}
                dataset={toolSubscriptionData}
                layout={'default'}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </>
    );
}
