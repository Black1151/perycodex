import {CustomerDetailsBanner} from "@/components/AdminDetailsBanners/CustomerDetailsBanner";
import {customerJson} from "@/components/surveyjs/forms/customer";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function MyCustomerPage() {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/my-company`);

    const {customerUniqueId} = userIdentity;

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
                isNew={false}
                dataset={customerData}
                sjsPath={'admin'}
                reloadPageOnSuccess={true}
            />
        </div>
    );
};
