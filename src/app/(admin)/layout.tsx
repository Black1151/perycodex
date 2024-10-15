import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/app/(admin)/AdminLayout";
import { NavBarProps } from "@/app/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface LayoutProps {
    children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    const cookieStore = cookies();
    const uniqueId = cookieStore.get("user_uuid")?.value;
    const authToken = cookieStore.get("auth_token")?.value;

    if (!uniqueId || !authToken) {
        return redirect("/login");
    }

    // Fetch user data
    let userIdentity = null;

    try {
        const identityResponse = await fetch(
            `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerId,role,userImageUrl,firstName`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        userIdentity = (await identityResponse.json()).resource;
    } catch (error) {
        return redirect("/error");
    }

    const userProps: NavBarProps = {
        userFirstName: userIdentity?.firstName,
        userImageUrl: userIdentity?.userImageUrl,
        userRole: userIdentity?.role,
        userCustomerId: userIdentity?.customerId,
    };

    return (
        <AdminLayout userProps={userProps}>
            {children}
        </AdminLayout>
    );
}
