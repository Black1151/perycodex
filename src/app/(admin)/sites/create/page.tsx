import {siteJson} from "@/components/surveyjs/forms/site";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function SitesCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/sites/create`);

    return (
        <>
            <AdminHeader headingText={'Create Site'}/>
            <SurveyComponent
                surveyJson={siteJson}
                endpoint={'/site'}
                isNew={true}
                redirectUrl={'/sites'}
                sjsPath={'admin'}
            />
        </>
    );
}
