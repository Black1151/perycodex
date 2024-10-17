import {userJson} from "@/components/surveyjs/forms/user"
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function UsersCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/users/create`);

    return (
        <>
            <AdminHeader headingText={'Create User'}/>
            <SurveyComponent
                surveyJson={userJson}
                endpoint={'/user'}
                isNew={true}
                redirectUrl={'/users'}
                sjsPath={'admin'}
            />
        </>
    );
}
