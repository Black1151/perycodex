import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {toolSubscriptionsJson} from "@/components/surveyjs/forms/toolSubscriptions";

export default async function ToolSubscriptionsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/tool-subscriptions/create");

    return (
        <>
            <AdminHeader headingText="Add Tool Subscription"/>
            <SurveyComponent
                surveyJson={toolSubscriptionsJson}
                endpoint={'/toolCustomer'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/tool-subscriptions'}
                sjsPath={'admin'}
            />
        </>
    );
}
