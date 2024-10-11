import React from 'react';
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import {userGroupJson} from "@/components/surveyJs/forms/userGroup";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {UserGroupDetailsBanner} from "@/components/AdminDetailsBanners/UserGroupDetailsBanner";

export default async function CustomerPage({params}: { params: { uniqueId: string } }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch userGroup data from the backend
    const res = await fetch(`${process.env.BE_URL}/userGroup/findBy?uniqueId=${params.uniqueId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const userGroup = await res.json();
    const userGroupData = userGroup.resource;

    return (
        <div>
            <UserGroupDetailsBanner userGroup={userGroupData}/>
            <SurveyJsComponent
                jsonSchema={userGroupJson}
                endpoint={`/userGroup/${params.uniqueId}`}
                isNew={false}
                dataset={userGroupData}
            />
        </div>
    );
};