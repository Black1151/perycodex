import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Heading} from "@chakra-ui/react";

// SurveyJS
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {userJson} from "@/components/surveyJs/forms/user"

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
            <Heading>Create User</Heading>
            <SurveyJsComponent jsonSchema={userJson} endpoint={'/helper'} isNew={true} />
        </>
    );
}
