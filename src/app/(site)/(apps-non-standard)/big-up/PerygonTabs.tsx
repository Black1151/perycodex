import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Text,
  Box,
} from "@chakra-ui/react";

interface TabsProps {
  tabs: { header: string; content: JSX.Element }[];
}

export const PerygonTabs: React.FC<TabsProps> = ({ tabs }) => {
  return (
    <Tabs
      display="flex"
      flexDirection="column"
      width="100%"
      height="80vh"
      maxWidth="90vh"
      bg="rgba(0, 0, 0, 0.85)"
      borderRadius="lg"
    >
      <TabList justifyContent="space-between">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            flex="1"
            textAlign="center"
            _selected={{
              color: "white",
              bg: "perygonPink",
              borderTopRadius: "lg",
            }}
          >
            <Text color="white">{tab.header}</Text>
          </Tab>
        ))}
      </TabList>

      <TabPanels flex="1" overflowY="auto">
        {tabs.map((tab, index) => (
          <TabPanel key={index} bg="rgba(0, 0, 0, 0)">
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
