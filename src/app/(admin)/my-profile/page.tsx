import React from 'react';
import {UserDetailsBanner} from "@/components/AdminDetailsBanners/UserDetailsBanner";
import {userJson} from "@/components/Z_surveyJs/forms/user";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";

export default async function UserPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const uniqueId = cookieStore.get("user_uuid")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    let userIdentity;

    try {
        const identityResponse = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=userUniqueId,role`,
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
        return redirect('/error');
    }

    const {userUniqueId, role} = userIdentity;

    if (role === 'PA') {
        return redirect("/customers");
    }

    try {
        const res = await fetch(`${process.env.BE_URL}/user/findBy?uniqueId=${userUniqueId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!res.ok) {
            return redirect('/error');
        }

        const user = await res.json();
        const userData = user.resource;

        // Step 3: Render the user details and survey
        return (
            <div>
                <UserDetailsBanner user={userData}/>
                <SurveyComponent
                    surveyJson={userJson}
                    endpoint={`/user/${userUniqueId}`}
                    isNew={false}
                    dataset={userData}
                    sjsPath={'admin'}
                />
            </div>
        );
    } catch (error) {
        return redirect('/error');
    }
};
