import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import AdminHeader from "@/components/AdminHeader";
import {happinessJson} from "@/components/Z_surveyJs/forms/happiness";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";


export default async function UsersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    return (
        <>
            <AdminHeader headingText={'Test Happiness Score'}/>
            <SurveyComponent
                surveyJson={happinessJson}
                endpoint={'/test'}
                isNew={true}
                layout={'happiness'}
                redirectUrl={'/customers'}
                jsPath={'registerSvgIcons'}
                cssPath={'happiness'}
                sjsPath={'happiness'}
            />
        </>
    );
}


