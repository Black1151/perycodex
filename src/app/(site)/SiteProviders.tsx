"use client";

import { ReactNode } from "react";
import { UserContextProps, UserProvider } from "@/providers/UserProvider";
import { WorkflowProvider } from "@/providers/WorkflowProvider";

import { UserModal } from "@/components/modals/userModal/userModal";

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
        {process.env.NODE_ENV === "development" && (
          <UserModal userMetadata={userMetadata} />
        )}
      </WorkflowProvider>
    </UserProvider>
  );
}
