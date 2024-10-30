'use client';

import React from 'react';
import {useWorkflow} from "@/providers/WorkflowProvider";
import {useRouter} from "next/navigation";

const WorkflowLayout = ({children,}: { children: React.ReactNode }) => {
        const {toolId, workflowId} = useWorkflow();
        const router = useRouter();

        if (!workflowId || !toolId) {
            router.push('/');
        }

        return (
            <>
                {children}
            </>
        );
    }
;

export default WorkflowLayout;