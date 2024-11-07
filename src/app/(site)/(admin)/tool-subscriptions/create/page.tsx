import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {toolSubscriptionsJson} from "@/components/surveyjs/forms/toolSubscriptions";
import {checkUserRole} from "@/lib/dal";

export default async function ToolSubscriptionsCreatePage() {
    await checkUserRole("/tool-subscriptions/create");

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
