import {createContext, ReactNode, useContext, useEffect, useState} from "react";


const WorkflowContext = createContext<any | null>(null);

// Custom hook to use the user context
export const useWorkflow = () => {
    const context = useContext(WorkflowContext);
    if (!context) {
        throw new Error("useWorkflow must be used within a WorkflowProvider");
    }
    return context;
};

// Provider component to wrap pages
export const WorkflowProvider: React.FC<{
    children: ReactNode;
}> = ({children}) => {
    const [toolId, setToolId] = useState<string | null>(null);
    const [workflowId, setWorkflowId] = useState<string | null>(null);

    // Load data from localStorage on mount
    useEffect(() => {
        const storedToolId = localStorage.getItem('toolId');
        const storedWorkflowId = localStorage.getItem('workflowId');
        if (storedToolId) setToolId(storedToolId);
        if (storedWorkflowId) setWorkflowId(storedWorkflowId);
    }, []);

    // Save to localStorage whenever toolId or workflowId changes
    useEffect(() => {
        if (toolId) localStorage.setItem('toolId', toolId);
        if (workflowId) localStorage.setItem('workflowId', workflowId);
    }, [toolId, workflowId]);


    return (
        <WorkflowContext.Provider value={{toolId, setToolId, workflowId, setWorkflowId}}>
            {children}
        </WorkflowContext.Provider>
    );
};

export default WorkflowContext;
