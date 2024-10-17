import {customerJson} from "@/components/surveyjs/forms/customer";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";

export default async function CustomersCreatePage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/customers/create`);

    return (
        <>
            <AdminHeader headingText={'Create Customer'}/>
            <SurveyComponent
                surveyJson={customerJson}
                endpoint={'/customer'}
                isNew={true}
                layout={'default'}
                redirectUrl={'/customers'}
                sjsPath={'admin'}
            />
        </>
    );
}
