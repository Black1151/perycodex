import { Tab, TabList, TabPanels, TabPanel, Tabs } from "@chakra-ui/react";

interface TabsProps {
  tabs: { header: string; content: JSX.Element }[];
}

export const PerygonTabs: React.FC<TabsProps> = ({ tabs }) => {
  return (
    <Tabs
      width="100%"
      bg="white"
      borderRadius="lg"
      maxWidth="90vh"
      overflow="hidden"
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
            {tab.header}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
