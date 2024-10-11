import React from 'react';
import SurveyJsComponent from "@/components/surveyJs/SurveyJsComponent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userTeamJson } from "@/components/surveyJs/forms/userTeam";
import { Heading, Spinner, Box } from "@chakra-ui/react";

export default async function UserTeamPage({ params }: { params: { uniqueId: string } }) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch userTeam data from the backend
    const res = await fetch(`${process.env.BE_URL}/userTeam/findBy?uniqueId=${params.uniqueId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!res.ok) {
        return redirect("/error");
    }

    const userTeam = await res.json();
    const userTeamData = userTeam?.resource;

    return (
        <div>
            <Heading>This is a Team Details Banner</Heading>
            <SurveyJsComponent
                jsonSchema={userTeamJson}
                endpoint={`/userTeam/${params.uniqueId}`}
                isNew={false}
                dataset={userTeamData}
            />
        </div>
    );
};
