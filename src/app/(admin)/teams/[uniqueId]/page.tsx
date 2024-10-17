import {redirect} from "next/navigation";
import {userTeamJson} from "@/components/surveyjs/forms/userTeam";
import {UserTeamDetailsBanner} from "@/components/AdminDetailsBanners/UserTeamDetailsBanner";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function TeamsDetailPage({params}: { params: { uniqueId: string } }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/teams/${params.uniqueId}`);

    const res = await apiClient(`/userTeam/findBy?uniqueId=${params.uniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const userTeam = await res.json();
    const userTeamData = userTeam?.resource;

    return (
        <div>
            <UserTeamDetailsBanner team={userTeamData}/>
            <SurveyComponent
                surveyJson={userTeamJson}
                endpoint={`/userTeam/${params.uniqueId}`}
                isNew={false}
                dataset={userTeamData}
                sjsPath={'admin'}
            />
        </div>
    );
};
