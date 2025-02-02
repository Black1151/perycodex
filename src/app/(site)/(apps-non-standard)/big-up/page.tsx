"use client";

import {useEffect, useState} from "react";
import {Box, Flex} from "@chakra-ui/react";
import {LeaderBoardTabContent} from "./tabs/LeaderBoardTab/LeaderBoardTabContent";
import {RecognitionList} from "./tabs/OtherTabs/RecognitionCardList";
import {PageClientInner} from "./PageClientInner";
import {BigUpData} from "./types";
import DashboardHeader from "@/app/(site)/(apps)/DashboardHeader";

export default function BigUpPage() {
    const [data, setData] = useState<BigUpData | null>(null);

    async function fetchData() {
        try {
            const response = await fetch("/api/auth/big-up/fetchBigUpDashboardData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    workflowId: 1,
                    businessProcessId: 1,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setData(result.resource);
            } else {
                console.error("Error from server response:", result);
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    const tabsData = [
        {
            header: "Leader Board",
            content: <LeaderBoardTabContent items={data.bigUpLeaderboard}/>,
        },
        {
            header: "The Wall",
            content: <RecognitionList items={data.bigUpWall}/>,
        },
        {
            header: "To Me",
            content: <RecognitionList items={data.bigUpToMe}/>,
        },
        {
            header: "From Me",
            content: <RecognitionList items={data.bigUpFromMe}/>,
        },
    ];

    const masonryData = {
        items: [
            {title: "Company: Total", content: data.totalBigUp},
            {title: "Company: Monthly Avg", content: data.averageBigUpMonthly},
            {title: "Company: Current Month", content: data.totalCurrentMonthBigUp},
            {title: "You: Total Given", content: data.yourBigUpStats.bigUpGivenPoints},
        ],
        userStats: data.yourBigUpStats,
    };

    const modalData = {
        teamMembers: data.users,
        categories: data.bigUpTypes,
    };

    return (
        <Flex
            w="100%"
            minH={["100%", "100vh"]} gap={2}
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            backgroundImage="url('/big-up/big-up-app-bg.webp')"
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            pt={[74, null, null, null]}
            pb={[4, 51, null, null, null]}
            px={[2, null, null, 5]}
        >
            <Flex bg="perygonBlueTransparent" w={'full'} alignItems="center" borderRadius={'lg'} p={2}>
                <DashboardHeader headingText={'Recognition Hub'} canStartWorkflow={false} toolUrl={'/big-up'}/>
            </Flex>
            <PageClientInner
                masonryData={masonryData}
                tabsData={tabsData}
                modalData={modalData}
                onDataUpdated={fetchData}
            />
        </Flex>
    );
}
