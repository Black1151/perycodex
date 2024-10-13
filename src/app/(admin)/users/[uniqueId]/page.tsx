import React from 'react';
import {UserDetailsBanner} from "@/components/AdminDetailsBanners/UserDetailsBanner";
import {userJson} from "@/components/surveyJs/forms/user";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import SurveyComponent from "@/components/surveyjs-new/SurveyComponent";

export default async function UserPage({params}: { params: { uniqueId: string } }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch user data from the backend
    const res = await fetch(`${process.env.BE_URL}/user/findBy?uniqueId=${params.uniqueId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const user = await res.json();
    const userData = user.resource;

    return (
        <>
            <UserDetailsBanner user={userData}/>
            <SurveyComponent
                surveyJson={userJson}
                endpoint={`/user/${params.uniqueId}`}
                isNew={false}
                dataset={userData}
            />
        </>
    );
};