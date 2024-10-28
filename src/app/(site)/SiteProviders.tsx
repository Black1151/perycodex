// components/ClientUserProvider.tsx (Client Component)
"use client";

import {ReactNode} from "react";
import {UserProvider} from "@/providers/UserProvider";

interface ClientUserProviderProps {
    children: ReactNode;
}

export default function SiteProviders({
                                          children,
                                      }: ClientUserProviderProps) {

    return (
        <UserProvider>
            {children}
        </UserProvider>
    )
}
