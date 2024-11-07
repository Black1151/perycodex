import {userGroupJson} from "@/components/surveyjs/forms/userGroup";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {checkUserRole} from "@/lib/dal";

export default async function UserGroupsCreatePage() {
    await checkUserRole(`/user-groups/create`);

    return (
        <>
            <AdminHeader headingText={'Create User Group'}/>
            <SurveyComponent
                surveyJson={userGroupJson}
                endpoint={'/userGroup'}
                isNew={true}
                redirectUrl={'/user-groups'}
                sjsPath={'admin'}
            />
        </>
    );
}
