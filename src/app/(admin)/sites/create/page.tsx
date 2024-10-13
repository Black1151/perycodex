import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Heading} from "@chakra-ui/react";

// SurveyJS
import {siteJson} from "@/components/surveyJs/forms/site";
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
            <AdminHeader headingText={'CREATE SITE'}/>
            <SurveyComponent
                surveyJson={siteJson}
                endpoint={'/site'}
                isNew={true}
                redirectUrl={'/sites'}
            />
        </>
    );
}
