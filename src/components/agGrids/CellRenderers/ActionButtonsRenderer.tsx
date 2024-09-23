'use client';

import React from 'react';
import {IconButton, Box} from "@chakra-ui/react"
import {Visibility} from '@mui/icons-material'; // MUI icons
import {useRouter} from 'next/navigation';

interface ActionButtonsRendererProps {
    node: { data: { uniqueId: string } }; // Ensure proper typing for node
    redirectUrl: string;
}

const ActionButtonsRenderer: React.FC<ActionButtonsRendererProps> = ({
                                                                         node,
                                                                         redirectUrl,
                                                                     }) => {
    const router = useRouter();

    // Handle View Button Click
    const handleViewClick = () => {
        if (node && node.data && node.data.uniqueId) {
            const uniqueId = node.data.uniqueId;
            router.push(`${redirectUrl}/${uniqueId}`);
        } else {
            console.error('Node or ID is not defined.');
        }
    };

    return (
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} height="100%">
            <IconButton
                aria-label="View"
                onClick={handleViewClick}
                color="primary"
                size="large"
                icon={<Visibility style={{fontSize: 'inherit', color: 'red'}}/>}
                style={{height: '100%'}}
            />

        </Box>
    );
};

export default ActionButtonsRenderer;
