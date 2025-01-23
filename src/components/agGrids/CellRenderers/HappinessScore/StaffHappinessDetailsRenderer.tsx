'use client';

import React, {useState} from 'react';
import {Avatar, Flex} from "@chakra-ui/react";
import StaffHappinessDetailModal
    from "@/app/(site)/(apps)/happiness-score/dashboard/company-dashboard/StaffHappinessDetailModal";
import {useWorkflow} from "@/providers/WorkflowProvider";

interface StaffHappinessDetailsProps {
    data: {
        userId?: number;
        fullName?: string;
        userImageUrl?: string;
    }
}

const StaffHappinessDetailsRenderer: React.FC<StaffHappinessDetailsProps> = ({data}) => {
    const {toolId, workflowId} = useWorkflow();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [staffHappinessDetailsModalData, setStaffHappinessDetailsModalData] = useState<any>(null);

    const handleUserClick = () => {
        if (data.userId) {
            fetchHappinessScoreTwoMonthHistory(data.userId);
        }
    };

    const fetchHappinessScoreTwoMonthHistory = async (userId: number) => {
        try {
            const response = await fetch("/api/happiness-graphs/getUserHappinessDetails", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({toolId: 1, workflowId: 1, businessProcessId: 1, userId}),
            });

            if (!response.ok) throw new Error("Failed to fetch happiness scores.");
            const result = await response.json();
            setStaffHappinessDetailsModalData(result.resource);
            setIsUserModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Flex
                justifyContent="center"
                alignItems="center"
                w="100%"
                h="100%"
                py={1}
                onClick={handleUserClick}
                cursor="pointer"
            >
                <Avatar name={data.fullName} src={data.userImageUrl} size="sm" sx={{fontSize: "0.65rem"}}/>
            </Flex>

            {isUserModalOpen && staffHappinessDetailsModalData && (
                <StaffHappinessDetailModal
                    isOpen={isUserModalOpen}
                    onClose={() => {
                        setIsUserModalOpen(false);
                        setStaffHappinessDetailsModalData(null);
                    }}
                    {...staffHappinessDetailsModalData}
                />
            )}
        </>
    );
};

export default StaffHappinessDetailsRenderer;