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

  const pathsToResetToolLogo = [
    "/happiness-score",
    "/client-satisfaction",
    "/business-score",
    "/risk-management",
  ];

  // Initialize state from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setToolId(localStorage.getItem("toolId"));
        setWorkflowId(localStorage.getItem("workflowId"));
        setCurrentWorkflowInstanceId(
          localStorage.getItem("currentWorkflowInstanceId"),
        );
        setCurrentBusinessProcessInstanceId(
          localStorage.getItem("currentBusinessProcessInstanceId"),
        );
      } catch (error) {
        console.error("Error initializing state from localStorage", error);
      }
    }
  }, []);

  // Handle pathname updates
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

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("toolId", toolId || "");
      } catch (error) {
        console.error("Error saving toolId to localStorage", error);
      }
    }
  }, [toolId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("workflowId", workflowId || "");
      } catch (error) {
        console.error("Error saving workflowId to localStorage", error);
      }
    }
  }, [workflowId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "currentWorkflowInstanceId",
          currentWorkflowInstanceId || "",
        );
      } catch (error) {
        console.error(
          "Error saving currentWorkflowInstanceId to localStorage",
          error,
        );
      }
    }
  }, [currentWorkflowInstanceId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "currentBusinessProcessInstanceId",
          currentBusinessProcessInstanceId || "",
        );
      } catch (error) {
        console.error(
          "Error saving currentBusinessProcessInstanceId to localStorage",
          error,
        );
      }
    }
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
