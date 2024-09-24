import React from 'react';
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {userJson} from "@/components/surveyJs/forms/user";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function CustomerPage ({ params }: { params: { uniqueId: string } }) {
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
        <div>
            <SurveyJsComponent jsonSchema={userJson} endpoint={'/user'} isNew={false} dataset={userData} />
        </div>
    );
};