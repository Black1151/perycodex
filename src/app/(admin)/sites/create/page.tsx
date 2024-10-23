import {siteJson} from "@/components/surveyjs/forms/site";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

interface SearchParams {
    siteType?: string
}

export default async function SitesCreatePage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/sites/create`);

    let headerTitle = "Create Site";
    let siteTypeParam = searchParams.siteType;

    if (userIdentity.role === 'CA') {
        if (!['internal', 'external'].includes(siteTypeParam || '')) {
            siteTypeParam = 'internal';
        }
        if (siteTypeParam === 'internal') {
            headerTitle = 'Create New Company Site ';
        } else if (siteTypeParam === 'external') {
            headerTitle = 'Create New Client Site';
        }
    } else if (userIdentity.role === 'PA') {
        headerTitle = 'Create Site';
    }

    const surveyVariables = [
        {
            "siteType": {
                siteTypeParam
            }
        }
    ]


    return (
        <>
            <AdminHeader headingText={headerTitle}/>
            <SurveyComponent
                surveyJson={siteJson}
                endpoint={'/site'}
                isNew={true}
                includeVariables={surveyVariables}
                redirectUrl={'/sites'}
                sjsPath={'admin'}
            />
        </>
    );
}
