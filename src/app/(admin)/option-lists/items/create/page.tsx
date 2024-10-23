import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {optionListItemsJson} from "@/components/surveyjs/forms/optionListItems";

export default async function OptionListItemsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/option-lists/items/create");

    return (
        <>
            <AdminHeader headingText="Create Option List Item"/>
            <SurveyComponent
                surveyJson={optionListItemsJson}
                endpoint={'/optionListItem'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/option-lists'}
                sjsPath={'admin'}
            />
        </>
    );
}
