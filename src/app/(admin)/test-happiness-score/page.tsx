import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {groupFields} from "@/components/agGrids/dataFields/userGroupFields";
import AdminHeader from "@/components/AdminHeader";
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {happinessJson} from "@/components/surveyJs/forms/happiness";

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
            <SurveyJsComponent
                jsonSchema={happinessJson}
                endpoint={'/helper'}
                isNew={true}
                cssPath={'/css/happiness.css'}
                sjsPath={"@/components/surveyJs/happiness/happiness"}
            />
        </>
    );
}

import "../../../components/surveyJs/happiness/index.css";

