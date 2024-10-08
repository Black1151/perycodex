'use client';

import React, {useState} from 'react';
import {Box, IconButton, Switch, useTheme} from "@chakra-ui/react";
import {Visibility} from '@mui/icons-material'; // MUI icons
import {useRouter} from 'next/navigation';
import {useFetchClient} from "@/hooks/useFetchClient";

interface ActionButtonsRendererProps {
    node: { data: { uniqueId: string; isActive: boolean } }; // Ensure proper typing for node
    redirectUrl: string;
    updateUrl: string;
}

const ActionButtonsRenderer: React.FC<ActionButtonsRendererProps> = ({
                                                                         node,
                                                                         redirectUrl,
                                                                         updateUrl
                                                                     }) => {
        const router = useRouter();
        const [isActive, setIsActive] = useState(node?.data?.isActive);
        const {fetchClient, loading} = useFetchClient();
        const theme = useTheme();

        // Handle View Button Click
        const handleViewClick = () => {
            if (node && node.data && node.data.uniqueId) {
                const uniqueId = node.data.uniqueId;
                router.push(`${redirectUrl}/${uniqueId}`);
            } else {
                console.error('Node or ID is not defined.');
                window.alert("Node or ID is not defined.");
            }
        };

        // Handle Toggle Active/Inactive Status
        const handleToggle = async () => {
            if (node && node.data && node.data.uniqueId) {
                const uniqueId = node.data.uniqueId;
                const newIsActive = !isActive;
                setIsActive(newIsActive); // Optimistically update UI

                // Send both uniqueId and data in the body as properly serialized JSON
                const result = await fetchClient(`${updateUrl}`, {
                    method: "PUT",
                    body: {
                        uniqueId,  // Include uniqueId in the body
                        data: {isActive: newIsActive},  // Add the new isActive state as part of data
                    },
                    errorMessage: "Unable to update record. Please try again.",
                    redirectOnError: false,
                });

                if (!result) {
                    setIsActive(!newIsActive); // Roll back UI update if the request fails
                }
            } else {
                console.error('Node or ID is not defined.');
            }
        };


        return (
            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} height="100%">
                <Switch
                    isChecked={isActive}
                    onChange={handleToggle}
                    variant={'primary'}
                    sx={{
                        alignSelf: "center",
                    }}
                />
                <IconButton
                    aria-label="View"
                    aspectRatio={1}
                    variant="agPrimary"
                    onClick={handleViewClick}
                    icon={<Visibility style={{fontSize: "inherit"}}/>}
                    sx={{
                        height: '80%',
                        alignSelf: "center",
                    }}
                />
            </Box>


        );
    }
;

export default ActionButtonsRenderer;
