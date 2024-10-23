import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {optionListJson} from "@/components/surveyjs/forms/optionLists";

export default async function OptionListsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/option-lists/lists/create");

    return (
        <>
            <AdminHeader headingText="Create Option List"/>
            <SurveyComponent
                surveyJson={optionListJson}
                endpoint={'/optionList'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/option-lists'}
                sjsPath={'admin'}
            />
        </>
    );
}
