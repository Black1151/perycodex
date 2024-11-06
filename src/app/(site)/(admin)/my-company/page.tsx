import {CustomerDetailsBanner} from "@/components/AdminDetailsBanners/CustomerDetailsBanner";
import {customerJson} from "@/components/surveyjs/forms/customer";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import apiClient from "@/lib/apiClient";
import {checkUserRole, getUser} from "@/lib/dal";

export default async function MyCustomerPage() {
    const user = await getUser();
    await checkUserRole(`/my-company`);

    const {customerUniqueId} = user;

    const res = await apiClient(`/customer/findBy?uniqueId=${customerUniqueId}`);

    if (!res.ok) {
        return redirect("/error");
    }

    const customer = await res.json();
    const customerData = customer.resource;

    return (
        <div>
            <CustomerDetailsBanner customer={customerData}/>
            <SurveyComponent
                surveyJson={customerJson}
                endpoint={`/customer/${customerUniqueId}`}
                rolesCanEdit={['CA', 'PA']}
                isNew={false}
                dataset={customerData}
                excludeKeys={['imageUrl']}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </div>
    );
};
