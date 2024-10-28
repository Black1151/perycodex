import React, {ReactNode} from "react";
import {Footer} from "@/components/layout/Footer";
import {PerygonContainer} from "@/components/layout/PerygonContainer";
import {NavBar} from "../NavBar";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import apiClient from "@/lib/apiClient";
import SiteProviders from "@/app/(site)/SiteProviders";

export const dynamic = "force-dynamic";


interface NavBarProps {
    userFirstName: string;
    userImageUrl: string;
    userRole: string;
    userCustomerId: string;
    logoImageUrl?: string;
}

export default async function MainLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const uniqueId = cookieStore.get("user_uuid")?.value;

    if (!authToken) {
        redirect("/login");
    }

    let userMetadata = {};

    try {
        const fetchUserMetadata = await apiClient(`/getUserMetadata`, {
            method: "POST",
            body: JSON.stringify({p_userUniqueId: uniqueId}),
            cache: 'no-store'
        })

        const userMetadataData = await fetchUserMetadata.json();

        userMetadata = userMetadataData.resource;

    } catch (error: any) {
        console.error("Error details:", error);
        redirect("/error");
    }

    ////// WE NEED TO LOOK AT ADDING THE NAVBAR PROPS TO THE METADATA FETCH AND GIVING TO NAVBAR VIA PROVIDER - This may solve the stubborn user caching bug

    return (
        <SiteProviders>
            <PerygonContainer>
                <NavBar/>
                {children}
            </PerygonContainer>
            <Footer/>
        </SiteProviders>
    )
}
