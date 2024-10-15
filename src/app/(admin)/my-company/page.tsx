import React from 'react';
import {CustomerDetailsBanner} from "@/components/AdminDetailsBanners/CustomerDetailsBanner";
import {customerJson} from "@/components/Z_surveyJs/forms/customer";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";

export default async function CustomerPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const uniqueId = cookieStore.get("user_uuid")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    let userIdentity;

    try {
        const identityResponse = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerUniqueId,role`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!identityResponse.ok) {
            throw new Error('Failed to fetch user identity');
        }

        userIdentity = (await identityResponse.json()).resource;
    } catch (error) {
        return "oops User";
    }

    const {customerUniqueId, role} = userIdentity;

    if (role === 'PA') {
        return redirect("/customers");
    }

    try {
        const res = await fetch(`${process.env.BE_URL}/customer/findBy?uniqueId=${customerUniqueId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            return "oops My Customer";
        }

        const customer = await res.json();
        const customerData = customer.resource;

        // Step 3: Render the customer details and survey
        return (
            <div>
                <CustomerDetailsBanner customer={customerData}/>
                <SurveyComponent
                    surveyJson={customerJson}
                    endpoint={`/customer/${customerUniqueId}`}
                    isNew={false}
                    dataset={customerData}
                    sjsPath={'admin'}
                />
            </div>
        );
    } catch (error) {
        return "My Customer 2";
    }
};
