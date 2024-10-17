import {userTeamJson} from "@/components/surveyjs/forms/userTeam";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function TeamsCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/teams/create`);

    return (
        <>
            <AdminHeader headingText={'Create Department / Team'}/>
            <SurveyComponent
                surveyJson={userTeamJson}
                endpoint={'/userTeam'}
                isNew={true}
                redirectUrl={'/teams'}
                sjsPath={'admin'}
            />
        </>
    );
}
