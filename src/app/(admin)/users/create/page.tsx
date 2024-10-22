import {userJson} from "@/components/surveyjs/forms/user"
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

interface SearchParams {
    userType?: string
}

export default async function UsersCreatePage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/users/create`);

    let headerTitle = "Create User";
    let userTypeParam = searchParams.userType;

    if (userIdentity.role === 'CA') {
        if (!['external'].includes(userTypeParam || '')) {
            userTypeParam = 'external';
            headerTitle = 'Create New Client User'
        } else if (userTypeParam === 'external') {
            headerTitle = 'Create New Client User';
        }
    } else if (userIdentity.role === 'PA') {
        headerTitle = 'Create User';
    }

    const surveyVariables = [
        {
            "userType": {
                userTypeParam
            }
        }
    ]


    return (
        <>
            <AdminHeader headingText={headerTitle}/>
            <SurveyComponent
                surveyJson={userJson}
                endpoint={'/user'}
                isNew={true}
                includeVariables={surveyVariables}
                redirectUrl={'/users'}
                sjsPath={'admin'}
            />
        </>
    );
}
