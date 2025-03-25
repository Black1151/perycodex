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
      bg="elementBG"
      borderRadius="lg"
    >
      <TabList justifyContent="space-between">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            flex="1"
            textAlign="center"
            color="primaryTextColor"
            _selected={{
              color: "white",
              bg: "primary",
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
          <TabPanel key={index}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
