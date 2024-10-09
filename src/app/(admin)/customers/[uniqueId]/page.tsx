import React from 'react';
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {CustomerDetailsBanner} from "@/components/AdminDetailsBanners/CustomerDetailsBanner"
import {customerJson} from "@/components/surveyJs/forms/customer";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function CustomerPage({params}: { params: { uniqueId: string } }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch customer data from the backend
    const res = await fetch(`${process.env.BE_URL}/customer/findBy?uniqueId=${params.uniqueId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const customer = await res.json();
    const customerData = customer.resource;

    return (
        <div>
            <CustomerDetailsBanner customer={customerData}/>
            <SurveyJsComponent
                jsonSchema={customerJson}
                endpoint={`/customer/${params.uniqueId}`}
                isNew={false}
                dataset={customerData}
            />
        </div>
    );
};