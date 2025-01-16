import React from 'react';
import {Box, Heading, ListItem, UnorderedList} from "@chakra-ui/react";

const Dashboard = () => {
    return (
        <Box color={"white"}>
            <Heading as={'h2'} fontSize={24}>Current Month</Heading>
            <UnorderedList>
                <ListItem>eNPS score for this current month compared to previous months</ListItem>
                <ListItem>Actual submissions for this currnt month vs total expected for this current month</ListItem>
                <ListItem>Histogram of submissions based on the current months submissions</ListItem>
            </UnorderedList>
        </Box>

    );
};

export default Dashboard;