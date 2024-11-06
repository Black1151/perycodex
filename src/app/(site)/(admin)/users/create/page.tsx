import {userJson} from "@/components/surveyjs/forms/user"
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import AdminHeader from "@/components/AdminHeader";
import {checkUserRole, getUser} from "@/lib/dal";

interface SearchParams {
    userType?: string
}

export default async function UsersCreatePage({searchParams}: { searchParams: SearchParams }) {
    const user = await getUser();
    await checkUserRole(`/users/create`);

    let headerTitle = "Create User";
    let userTypeParam = searchParams.userType;

    if (user.role === 'CA') {
        if (!['external'].includes(userTypeParam || '')) {
            userTypeParam = 'external';
            headerTitle = 'Create New Client User'
        } else if (userTypeParam === 'external') {
            headerTitle = 'Create New Client User';
        }
    } else if (user.role === 'PA') {
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
                excludeKeys={['imageUrl']}
                includeVariables={surveyVariables}
                redirectUrl={'/users'}
                sjsPath={'admin'}
            />
        </>
    );
}
