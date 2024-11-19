"use client";

import React, { useEffect } from "react";
import { useWorkflow } from "@/providers/WorkflowProvider";

interface WorkflowEngineProps {
  toolId: string | null;
  children: React.ReactNode;
}

const WorkflowEngine: React.FC<WorkflowEngineProps> = ({
  toolId,
  children,
}) => {
  const { setToolId } = useWorkflow();

  useEffect(() => {
    if (toolId) {
      setToolId(toolId);
    }

    // Optionally, reset toolId when the component unmounts
    return () => {
      setToolId(null);
    };
  }, [toolId, setToolId]);

  return <>{children}</>;
};

export default WorkflowEngine;
