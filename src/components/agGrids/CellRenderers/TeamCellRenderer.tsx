import React from 'react';
import {Badge, Flex} from "@chakra-ui/react";
import {ICellRendererParams} from "ag-grid-community";

// Define the interface for the specific parameters used in this cell renderer
interface TeamCellRendererParams extends ICellRendererParams {
    data: {
        parentTeamId: number | null;
    };
}

// Define the component with correct typing for Ag-Grid
const TeamCellRenderer: React.FC<TeamCellRendererParams> = ({data}) => {
    // Check if the data is present and determine if it's a department
    const isDepartment = data?.parentTeamId === null;

    return (
        <Flex
            justify="flex-start"
            align="center"
            width="auto" // Set the width to auto to fit content
            height="auto" // Set the height to auto to fit content
        >
            {/*<Badge*/}
            {/*    colorScheme={isDepartment ? 'purple' : 'blue'}*/}
            {/*    variant="solid"*/}
            {/*    borderRadius="md"*/}
            {/*    fontSize="xs"*/}
            {/*    px={2} // Optional: Add padding to better fit content*/}
            {/*    py={0.5} // Optional: Add padding to better fit content*/}
            {/*>*/}
            {/*    {isDepartment ? 'Department' : 'Team'}*/}
            {/*</Badge>*/}
            {isDepartment ? 'Department' : 'Team'}
        </Flex>
    );
};

// Export the component as default
export default TeamCellRenderer;
