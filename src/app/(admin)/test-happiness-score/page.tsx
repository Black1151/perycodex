import AdminHeader from "@/components/AdminHeader";
import {happinessJson} from "@/components/surveyjs/forms/happiness";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";


export default async function TestHappinessScorePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/test-happiness-score`);

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


