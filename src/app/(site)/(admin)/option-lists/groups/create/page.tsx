import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {optionListGroupsJson} from "@/components/surveyjs/forms/optionListGroups";

export default async function OptionListGroupsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/option-lists/groups/create");

    return (
        <>
            <AdminHeader headingText="Create Option List Group"/>
            <SurveyComponent
                surveyJson={optionListGroupsJson}
                endpoint={'/optionListGroup'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/option-lists'}
                sjsPath={'admin'}
            />
        </>
    );
}
