import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// SurveyJS
import {customerJson} from "@/components/surveyJs/forms/customer";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs-new/SurveyComponent";

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
            <AdminHeader headingText={'CREATE CUSTOMER'}/>
            <SurveyComponent
                surveyJson={customerJson}
                endpoint={'/customer'}
                isNew={true}
                redirectUrl={'/customers'}
            />
        </>
    );
}
