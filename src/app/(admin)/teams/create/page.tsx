import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// SurveyJS
import {userTeamJson} from "@/components/Z_surveyJs/forms/userTeam";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function CustomersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    return (
        <>
            <AdminHeader headingText={'CREATE DEPARTMENT / TEAM'}/>
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
