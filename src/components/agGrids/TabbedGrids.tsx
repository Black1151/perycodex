"use client";

import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { ColDef } from "ag-grid-community";

interface DataSource {
  data: any[];
  title: string;
  fields: ColDef[];
  createNewUrl?: string;
  createNewUrlButtonText?: string;
  isModalEnabled?: boolean;
  openModalComponent?: React.ElementType;
}

interface TabbedDataGridProps {
  dataSources: DataSource[];
}

const TabbedGrids: React.FC<TabbedDataGridProps> = ({ dataSources }) => {
  return (
    <Box borderRadius="md" mt={4}>
      <Tabs variant="enclosed" size="md" isFitted>
        <TabList>
          {dataSources.map((source, index) => (
            <Tab key={index} _selected={{ color: "white", bg: "perygonPink" }}>
              {source.title}
              <Text as="sup" size="sm">
                {source.data.length}
              </Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {dataSources.map((source, index) => (
            <TabPanel key={index}>
              <DataGridComponent
                data={source.data}
                initialFields={source.fields}
                createNewUrl={source.createNewUrl}
                createNewUrlButtonText={source.createNewUrlButtonText}
                isModalEnabled={source.isModalEnabled}
                openModalComponent={source.openModalComponent}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TabbedGrids;
