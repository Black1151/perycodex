"use client";

import {ReactNode} from "react";
import {UserContextProps, UserProvider} from "@/providers/UserProvider";
import {WorkflowProvider} from "@/providers/WorkflowProvider";

interface ClientUserProviderProps {
    children: ReactNode;
    userMetadata: UserContextProps;
}

export default function SiteProviders({
                                          children,
                                          userMetadata,
                                      }: ClientUserProviderProps) {

    return (
        <UserProvider value={userMetadata}>
            <WorkflowProvider>
                {children}
            </WorkflowProvider>
        </UserProvider>
    )
}
