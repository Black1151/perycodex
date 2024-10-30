// components/ClientUserProvider.tsx (Client Component)
"use client";

import {ReactNode} from "react";
import {UserProvider} from "@/providers/UserProvider";
import {WorkflowProvider} from "@/providers/WorkflowProvider";

interface ClientUserProviderProps {
    children: ReactNode;
}

export default function SiteProviders({
                                          children,
                                      }: ClientUserProviderProps) {

    return (
        <UserProvider>
            <WorkflowProvider>
                {children}
            </WorkflowProvider>
        </UserProvider>
    )
}
