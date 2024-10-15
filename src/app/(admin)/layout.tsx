import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/app/(admin)/AdminLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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

export default async function Layout({ children }: LayoutProps) {
    const cookieStore = cookies();
    const uniqueId = cookieStore.get("user_uuid")?.value;
    const authToken = cookieStore.get("auth_token")?.value;

    // Log cookie values
    console.log("Fetched cookies:");
    console.log("user_uuid:", uniqueId);
    console.log("auth_token:", authToken);

    if (!uniqueId || !authToken) {
        console.log("Missing uniqueId or authToken, redirecting to login...");
        return redirect("/login");
    }

    // Fetch user data
    let userIdentity = null;

    try {
        console.log("Fetching user identity...");
        const identityResponse = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerId,role,userImageUrl,firstName`,
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
        console.log("Fetched user identity:", userIdentity);
    } catch (error) {
        console.error("Error fetching user identity:", error);
        return redirect("/error");
    }

    const userProps: NavBarProps = {
        userFirstName: userIdentity?.firstName,
        userImageUrl: userIdentity?.userImageUrl,
        userRole: userIdentity?.role,
        userCustomerId: userIdentity?.customerId,
    };

    // Log the final props being passed to AdminLayout
    console.log("Rendering AdminLayout with userProps:", userProps);

    return (
        <AdminLayout userProps={userProps}>
            {children}
        </AdminLayout>
    );
}
