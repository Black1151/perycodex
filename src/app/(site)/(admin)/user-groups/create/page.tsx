import {userGroupJson} from "@/components/surveyjs/forms/userGroup";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function UserGroupsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/user-groups/create`);

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
