"use client";

import { ReactNode } from "react";
import { UserContextProps, UserProvider } from "@/providers/UserProvider";
import { WorkflowProvider } from "@/providers/WorkflowProvider";

import { UserModal } from "@/components/modals/userModal/UserModal";
import { WorkflowModal } from "@/components/modals/workflowModal/WorkflowModal";
import { DeveloperBoard } from "@mui/icons-material";
import DeveloperBoardOptions from "@/app/(site)/DeveloperBoardOptions";

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
        <DeveloperBoardOptions userMetadata={userMetadata} />
      </WorkflowProvider>
    </UserProvider>
  );
}
