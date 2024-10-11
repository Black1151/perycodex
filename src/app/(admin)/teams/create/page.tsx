import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Heading} from "@chakra-ui/react";

// SurveyJS
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {userTeamJson} from "@/components/surveyJs/forms/userTeam";
import AdminHeader from "@/components/AdminHeader";

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
            <AdminHeader headingText={'CREATE DEPARTMENT / TEAM'} />
            <SurveyJsComponent
                jsonSchema={userTeamJson}
                endpoint={'/userTeam'}
                isNew={true}
                redirectUrl={'/teams'}
            />
        </>
    );
}
