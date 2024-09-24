import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Heading} from "@chakra-ui/react";

// SurveyJS
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {siteJson} from "@/components/surveyJs/forms/site";

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
            <Heading>Create Site</Heading>
            <SurveyJsComponent jsonSchema={siteJson} endpoint={'help'} isNew={true} />
        </>
    );
}
