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
        console.log(`I am fetching the toolConfig Data for: ${toolId}`);
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
  }, [toolId]);

  return (
    <WorkflowContext.Provider
      value={{
        toolId,
        setToolId,
        toolLogo,
        toolPath,
        workflowId,
        setWorkflowId,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;
