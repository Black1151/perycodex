import {ReactNode} from "react";
import {redirect} from "next/navigation";
import {AdminLayout} from "@/app/(admin)/AdminLayout";
import {getUserIdentity} from "@/lib/getUserIdentity";

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
