"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { usePathname } from "next/navigation";

interface ToolConfigResponse {
  resource: {
    id: number;
    logoImageUrl: string;
    appUrl: string;
  };
}

const WorkflowContext = createContext<{
  toolId: string | null;
  setToolId: (id: string | null) => void;
  toolLogo: string | null;
  toolPath: string | null;
  workflowId: string | null;
  setWorkflowId: (id: string | null) => void;
  currentWorkflowInstanceId: string | null;
  setCurrentWorkflowInstanceId: (id: string | null) => void;
  currentBusinessProcessInstanceId: string | null;
  setCurrentBusinessProcessInstanceId: (id: string | null) => void;
} | null>(null);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toolId, setToolId] = useState<string | null>(
    localStorage.getItem("toolId") || null,
  );
  const [workflowId, setWorkflowId] = useState<string | null>(
    localStorage.getItem("workflowId") || null,
  );
  const [currentWorkflowInstanceId, setCurrentWorkflowInstanceId] = useState<
    string | null
  >(localStorage.getItem("currentWorkflowInstanceId") || null);
  const [
    currentBusinessProcessInstanceId,
    setCurrentBusinessProcessInstanceId,
  ] = useState<string | null>(
    localStorage.getItem("currentBusinessProcessInstanceId") || null,
  );
  const [toolLogo, setToolLogo] = useState<string | null>(null);
  const [toolPath, setToolPath] = useState<string | null>(null);
  const { fetchClient } = useFetchClient();
  const pathname = usePathname(); // Hook to get the current path

  const pathsToResetToolLogo = [
    "/happiness-score",
    "/client-satisfaction",
    "/business-score",
    "/risk-management",
  ];

  useEffect(() => {
    const shouldReset = pathsToResetToolLogo.some((path) =>
      pathname.startsWith(path),
    );
    if (!shouldReset) {
      setToolLogo(null);
      setToolPath(null);
      setToolId(null);
      setWorkflowId(null);
    }
  }, [pathname]);

  // Fetch tool configuration when toolId changes
  useEffect(() => {
    const fetchToolConfig = async () => {
      if (toolId) {
        try {
          const res: ToolConfigResponse | null = await fetchClient(
            `/api/toolConfig/findBy?id=${toolId}`,
          );
          if (res?.resource?.appUrl && toolId && workflowId) {
            setToolPath(
              `${res.resource.appUrl}?toolId=${toolId}&wfId=${workflowId}`,
            );
          }
          if (res?.resource?.logoImageUrl) {
            setToolLogo(res.resource.logoImageUrl);
          } else {
            setToolLogo(null);
            console.error("Invalid response structure or missing logoImageUrl");
          }
        } catch (error) {
          console.error("Error fetching tool config:", error);
        }
      }
    };

    fetchToolConfig();
  }, [toolId, workflowId]);

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem("toolId", toolId || "");
  }, [toolId]);

  useEffect(() => {
    localStorage.setItem("workflowId", workflowId || "");
  }, [workflowId]);

  useEffect(() => {
    localStorage.setItem(
      "currentWorkflowInstanceId",
      currentWorkflowInstanceId || "",
    );
  }, [currentWorkflowInstanceId]);

  useEffect(() => {
    localStorage.setItem(
      "currentBusinessProcessInstanceId",
      currentBusinessProcessInstanceId || "",
    );
  }, [currentBusinessProcessInstanceId]);

  return (
    <WorkflowContext.Provider
      value={{
        toolId,
        setToolId,
        toolLogo,
        toolPath,
        workflowId,
        setWorkflowId,
        currentWorkflowInstanceId,
        setCurrentWorkflowInstanceId,
        currentBusinessProcessInstanceId,
        setCurrentBusinessProcessInstanceId,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;
