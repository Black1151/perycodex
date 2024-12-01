"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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

interface WorkflowContextType {
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
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

const pathsToResetToolLogo = [
  "/happiness-score",
  "/client-satisfaction",
  "/business-score",
  "/risk-management",
];

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toolId, setToolId] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [currentWorkflowInstanceId, setCurrentWorkflowInstanceId] = useState<
    string | null
  >(null);
  const [
    currentBusinessProcessInstanceId,
    setCurrentBusinessProcessInstanceId,
  ] = useState<string | null>(null);
  const [toolLogo, setToolLogo] = useState<string | null>(null);
  const [toolPath, setToolPath] = useState<string | null>(null);

  const { fetchClient } = useFetchClient();
  const pathname = usePathname();

  // Helper to get and save to localStorage
  const localStorageManager = {
    get: (key: string): string | null => localStorage.getItem(key),
    set: (key: string, value: string | null) => {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key); // Remove key if value is null
    },
  };

  // Load initial state from localStorage on mount
  useEffect(() => {
    setToolId(localStorageManager.get("toolId"));
    setWorkflowId(localStorageManager.get("workflowId"));
    setCurrentWorkflowInstanceId(
      localStorageManager.get("currentWorkflowInstanceId"),
    );
    setCurrentBusinessProcessInstanceId(
      localStorageManager.get("currentBusinessProcessInstanceId"),
    );
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorageManager.set("toolId", toolId);
    localStorageManager.set("workflowId", workflowId);
    localStorageManager.set(
      "currentWorkflowInstanceId",
      currentWorkflowInstanceId,
    );
    localStorageManager.set(
      "currentBusinessProcessInstanceId",
      currentBusinessProcessInstanceId,
    );
  }, [
    toolId,
    workflowId,
    currentWorkflowInstanceId,
    currentBusinessProcessInstanceId,
  ]);

  // Fetch tool configuration when toolId or workflowId changes
  useEffect(() => {
    const fetchToolConfig = async () => {
      if (!toolId || !workflowId) return;

      try {
        const res: ToolConfigResponse | null = await fetchClient(
          `/api/toolConfig/findBy?id=${toolId}`,
        );
        if (res?.resource) {
          setToolPath(
            `${res.resource.appUrl}?toolId=${toolId}&wfId=${workflowId}`,
          );
          setToolLogo(res.resource.logoImageUrl || null);
        } else {
          setToolLogo(null);
        }
      } catch (error) {
        console.error("Error fetching tool config:", error);
      }
    };

    fetchToolConfig();
  }, [toolId, workflowId]);

  // Reset tool logo and path when navigating to specific paths
  useEffect(() => {
    const shouldReset = pathsToResetToolLogo.some((path) =>
      pathname.startsWith(path),
    );
    if (!shouldReset) {
      setToolId(null);
      setWorkflowId(null);
      setToolLogo(null);
      setToolPath(null);
    }
  }, [pathname]);

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
