import React from "react";
import { UserModal } from "@/components/modals/userModal/UserModal";
import { WorkflowModal } from "@/components/modals/workflowModal/WorkflowModal";
import { UserContextProps, useUser } from "@/providers/UserProvider";

interface DeveloperBoardOptionsProps {
  userMetadata: UserContextProps;
}

const DeveloperBoardOptions: React.FC<DeveloperBoardOptionsProps> = ({
  userMetadata,
}) => {
  const { showDeveloperBoard } = useUser();

  if (process.env.NODE_ENV !== "development" || showDeveloperBoard === false)
    return null;

  return (
    <>
      <UserModal userMetadata={userMetadata} />
      <WorkflowModal />
    </>
  );
};

export default DeveloperBoardOptions;
