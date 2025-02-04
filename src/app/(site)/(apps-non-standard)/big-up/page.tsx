"use client";

import {useEffect, useState} from "react";
import {Flex} from "@chakra-ui/react";
import {LeaderBoardTabContent} from "./tabs/LeaderBoardTab/LeaderBoardTabContent";
import {RecognitionList} from "./tabs/OtherTabs/RecognitionCardList";
import {PageClientInner} from "./PageClientInner";
import {
    BigUpCategory,
    BigUpLeaderboardEntry,
    BigUpStats,
    BigUpTeamMember,
    BigUpWallEntry,
} from "./types";

export default function BigUpPage() {
    const [bigUpLeaderboard, setBigUpLeaderboard] = useState<BigUpLeaderboardEntry[]>([]);
    const [bigUpWall, setBigUpWall] = useState<BigUpWallEntry[]>([]);
    const [bigUpToMe, setBigUpToMe] = useState<BigUpWallEntry[]>([]);
    const [bigUpFromMe, setBigUpFromMe] = useState<BigUpWallEntry[]>([]);
    const [totalBigUp, setTotalBigUp] = useState<number>(0);
    const [averageBigUpMonthly, setAverageBigUpMonthly] = useState<number>(0);
    const [totalCurrentMonthBigUp, setTotalCurrentMonthBigUp] = useState<number>(0);
    const [yourBigUpStats, setYourBigUpStats] = useState<BigUpStats>({
        bigUpGivenPoints: 0,
        bigUpReceivedPoints: 0,
        bigUpTotal: 0,
        bigUpRanking: 0,
        userName: "",
        userLocation: "",
        userImage: ""
    });
    const [teamMembers, setTeamMembers] = useState<BigUpTeamMember[]>([]);
    const [bigUpCategories, setBigUpCategories] = useState<BigUpCategory[]>([]);
    const [loading, setLoading] = useState(true);

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
                setBigUpLeaderboard(result.resource.bigUpLeaderboard || []);
                setBigUpWall(result.resource.bigUpWall || []);
                setBigUpToMe(result.resource.bigUpToMe || []);
                setBigUpFromMe(result.resource.bigUpFromMe || []);
                setTotalBigUp(result.resource.totalBigUp || 0);
                setAverageBigUpMonthly(result.resource.averageBigUpMonthly || 0);
                setTotalCurrentMonthBigUp(result.resource.totalCurrentMonthBigUp || 0);
                setYourBigUpStats(result.resource.yourBigUpStats || null);
                setTeamMembers(result.resource.users || []);
                setBigUpCategories(result.resource.bigUpTypes || []);
            } else {
                console.error("Error from server response:", result);
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const tabsData = [
        {header: "Leader Board", content: <LeaderBoardTabContent items={bigUpLeaderboard}/>},
        {header: "The Wall", content: <RecognitionList items={bigUpWall}/>},
        {header: "To Me", content: <RecognitionList items={bigUpToMe} reverseRecognition={true}/>},
        {header: "From Me", content: <RecognitionList items={bigUpFromMe}/>},
    ];

    const masonryData = {
        items: [
            {title: "Company: Total", content: totalBigUp.toLocaleString()},
            {title: "Company: Monthly Avg", content: averageBigUpMonthly.toFixed(2)},
            {title: "Company: Current Month", content: totalCurrentMonthBigUp.toLocaleString()},
            {title: "You: Total Given", content: yourBigUpStats.bigUpGivenPoints.toLocaleString()},
        ],
        userStats: yourBigUpStats,
    };

    const modalData = {
        teamMembers: teamMembers,
        categories: bigUpCategories,
    };

    return (
        <Flex
            w="100%"
            maxH="100%"
            gap={2}
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
            <PageClientInner
                masonryData={masonryData}
                tabsData={tabsData}
                modalData={modalData}
                onDataUpdated={fetchData}
            />
        </Flex>
    );
}
