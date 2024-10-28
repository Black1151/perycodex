import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {businessProcessJson} from "@/components/surveyjs/forms/businessProcess";

export default async function BusinessProcessCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/business-processes/create");

    return (
        <>
            <AdminHeader headingText="Create Business Process"/>
            <SurveyComponent
                surveyJson={businessProcessJson}
                endpoint={'/businessProcess'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/business-processes'}
                sjsPath={'admin'}
            />
        </>
    );
}
