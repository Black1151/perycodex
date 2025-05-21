"use client";

import { ReactNode, useEffect } from "react";
import { UserContextProps, UserProvider } from "@/providers/UserProvider";
import { WorkflowProvider } from "@/providers/WorkflowProvider";
import DeveloperBoardOptions from "@/app/(site)/DeveloperBoardOptions";
import { useThemeContext } from "@/providers/ChakraThemeProvider";

interface ClientUserProviderProps {
  children: ReactNode;
  userMetadata: UserContextProps;
}

export default function SiteProviders({
  children,
  userMetadata,
}: ClientUserProviderProps) {
  const { setThemeId } = useThemeContext();

  useEffect(() => {
    if (userMetadata.userThemeId) {
      setThemeId(userMetadata.userThemeId);
    } else {
      setThemeId(userMetadata.customerDefaultThemeId);
    }
  }, [userMetadata]);

  return (
    <UserProvider value={userMetadata}>
      {children}
      <DeveloperBoardOptions userMetadata={userMetadata} />
    </UserProvider>
  );
}
