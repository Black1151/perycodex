// components/ClientUserProvider.tsx (Client Component)
"use client";

import { ReactNode } from "react";
import { UserContextProps, UserProvider } from "@/context/AdminUserContext";

interface ClientUserProviderProps {
  children: ReactNode;
  userMetadata: UserContextProps;
}

export default function SiteProviders({
  children,
  userMetadata,
}: ClientUserProviderProps) {
  return <UserProvider value={userMetadata}>{children}</UserProvider>;
}
