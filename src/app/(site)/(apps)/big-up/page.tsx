import { Card, Grid, Text } from "@chakra-ui/react";
import { Masonry } from "./Masonry";
import { PerygonTabs } from "./PerygonTabs";
import { LeaderBoardTabContent } from "./tabs/LeaderBoardTab/LeaderBoardTabContent";
import { RecognitionList } from "./tabs/OtherTabs/RecognitionCardList";

export default function Home() {
  const dummyRecognitionItems = [
    {
      id: "1",
      name: "John Doe",
      recognizedBy: "Jane Smith",
      message: "Great job on the project!",
      date: "2023-10-01",
      avatarUrl: "https://example.com/avatar1.png",
      badge: "Top Performer",
    },
    {
      id: "2",
      name: "Alice Johnson",
      recognizedBy: "Bob Brown",
      message: "Excellent presentation skills.",
      date: "2023-10-02",
      avatarUrl: "https://example.com/avatar2.png",
      badge: "Best Speaker",
    },
  ];

  const dummyLeaderboardItems = [
    {
      name: "John Doe",
      location: "New York",
      received: 10,
      given: 5,
      score: 95,
    },
    {
      name: "Alice Johnson",
      location: "Los Angeles",
      received: 8,
      given: 7,
      score: 90,
    },
    {
      name: "John Doe",
      location: "New York",
      received: 10,
      given: 5,
      score: 95,
    },
    {
      name: "Alice Johnson",
      location: "Los Angeles",
      received: 8,
      given: 7,
      score: 90,
    },
    {
      name: "John Doe",
      location: "New York",
      received: 10,
      given: 5,
      score: 95,
    },
    {
      name: "Alice Johnson",
      location: "Los Angeles",
      received: 8,
      given: 7,
      score: 90,
    },
    {
      name: "John Doe",
      location: "New York",
      received: 10,
      given: 5,
      score: 95,
    },
    {
      name: "Alice Johnson",
      location: "Los Angeles",
      received: 8,
      given: 7,
      score: 90,
    },
    {
      name: "John Doe",
      location: "New York",
      received: 10,
      given: 5,
      score: 95,
    },
    {
      name: "Alice Johnson",
      location: "Los Angeles",
      received: 8,
      given: 7,
      score: 90,
    },
  ];

  const dummyMasonryItems = [
    {
      title: "Project Success",
      content: "7748",
    },
    {
      title: "Team Meeting",
      content: "D3434",
    },
    {
      title: "Client Feedback",
      content: "1345",
    },
    {
      title: "New Initiative",
      content: "300",
    },
  ];

  const tabsData = [
    {
      header: "LeaderBoard",
      content: <LeaderBoardTabContent items={dummyLeaderboardItems} />,
    },
    {
      header: "The Wall",
      content: <RecognitionList items={dummyRecognitionItems} />,
    },
    {
      header: "To Me",
      content: <RecognitionList items={dummyRecognitionItems} />,
    },
    {
      header: "From Me",
      content: <RecognitionList items={dummyRecognitionItems} />,
    },
  ];

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
      <Masonry items={dummyMasonryItems} />
      <PerygonTabs tabs={tabsData} />
    </Grid>
  );
}
