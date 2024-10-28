import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {selectItemsJson} from "@/components/surveyjs/forms/selectItems";

export default async function OptionListsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/select-items/create");

    return (
        <>
            <AdminHeader headingText="Create Select Item"/>
            <SurveyComponent
                surveyJson={selectItemsJson}
                endpoint={'/selectItem'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/select-items'}
                sjsPath={'admin'}
            />
        </>
    );
}
