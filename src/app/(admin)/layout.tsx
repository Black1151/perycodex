import {ReactNode} from "react";
import {AdminLayout} from "@/app/(admin)/AdminLayout";
import {getUserIdentity} from "@/lib/getUserIdentity";
import apiClient from "@/lib/apiClient";

export interface NavBarProps {
    userFirstName: string;
    userImageUrl: string;
    userRole: string;
    userCustomerId: string;
    logoImageUrl?: string;
}

interface LayoutProps {
    children: ReactNode;
}

export default async function Layout({children}: LayoutProps) {
    const userIdentity = await getUserIdentity();

    console.log(userIdentity)

    const response = await apiClient(`/getUserMetadata`, {
        method: "POST",
        body: JSON.stringify({
            p_userUniqueId: userIdentity.userUniqueId
        })
    });


    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Error response:', errorBody);
        throw new Error(`Failed to fetch user metadata: ${errorBody?.message || 'Unknown error'}`);
    }


    let userMetadata = (await response.json()).resource;


    const userProps: NavBarProps = {
        userFirstName: userIdentity?.firstName,
        userImageUrl: userIdentity?.userImageUrl,
        userRole: userIdentity?.role,
        userCustomerId: userIdentity?.customerId,
    };

    return (
        <AdminLayout userProps={userProps} userMetadata={userMetadata}>
            {children}
        </AdminLayout>
    );
}
