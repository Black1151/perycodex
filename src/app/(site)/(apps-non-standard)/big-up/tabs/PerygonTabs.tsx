import { hideScrollbar } from "@/utils/style/style-utils";
import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Text,
} from "@chakra-ui/react";

export interface PerygonTabsProps {
  tabs: { header: string; content: JSX.Element }[];
}

export const PerygonTabs: React.FC<PerygonTabsProps> = ({ tabs }) => {
  return (
    <Tabs
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      bg="perygonBlueTransparent"
      borderRadius="lg"
    >
      <TabList justifyContent="space-between">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            flex="1"
            textAlign="center"
            color="white"
            _selected={{
              color: "perygonBlue",
              bg: "silver",
              borderTopRadius: "lg",
            }}
          >
            <Text>{tab.header}</Text>
          </Tab>
        ))}
      </TabList>

      <TabPanels
        flex="1"
        overflowY="auto"
        sx={{
          "@media (max-width: 400px)": {
            ...hideScrollbar,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <TabPanel key={index} bg="rgba(0, 0, 0, 0)">
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
