import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// SurveyJS
import {userJson} from "@/components/Z_surveyJs/forms/user"
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
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
            <AdminHeader headingText={'CREATE USER'}/>
            <SurveyComponent
                surveyJson={userJson}
                endpoint={'/user'}
                isNew={true}
                redirectUrl={'/users'}
            />
        </>
    );
}
