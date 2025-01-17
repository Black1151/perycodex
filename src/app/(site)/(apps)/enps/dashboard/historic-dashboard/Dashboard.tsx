import React from 'react';
import {Box, Heading, ListItem, UnorderedList} from "@chakra-ui/react";

const Dashboard = () => {
    return (
        <Box color={"white"}>
            <Heading as={'h2'} fontSize={24}>Based on dates given submissions (from database - Calendar YTD, Financial
                YTD, 1 month prev, quarter prev)</Heading>
            <UnorderedList>
                <ListItem>Line Chart showing monthly comparisons of those submitted and participated</ListItem>
                <ListItem>Histogram of all submissions in date period</ListItem>
                <ListItem>Sankey of all submissions split by Passives, Promoters, Detractors for date period</ListItem>
            </UnorderedList>
        </Box>

    );
};

export default Dashboard;