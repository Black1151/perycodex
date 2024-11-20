"use client";

import React, { useState } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import DraggableGridsComponent from "@/components/agGrids/DraggableGridsComponent";
import { userGroupJson } from "@/components/surveyjs/forms/userGroup";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { userFieldDefs } from "./userFields";
import { teamFieldDefs } from "./teamFields";

interface UserGroupsTabsProps {
  userGroupId: string;
  userGroupData: any;
  userPopulationData: any[];
  userSampleData: any[];
  teamPopulationData: any[];
  teamSampleData: any[];
}

const UserGroupsTabs: React.FC<UserGroupsTabsProps> = ({
  userGroupId,
  userGroupData,
  userPopulationData,
  userSampleData,
  teamPopulationData,
  teamSampleData,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [pendingTabIndex, setPendingTabIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleTabChange = (index: number) => {
    if (activeTabIndex === 1 || activeTabIndex === 2) {
      setPendingTabIndex(index);
      onOpen();
    } else {
      setActiveTabIndex(index);
    }
  };

  const confirmTabChange = () => {
    if (pendingTabIndex !== null) {
      setActiveTabIndex(pendingTabIndex);
      setPendingTabIndex(null);
    }
    onClose();
  };

  return (
    <>
      <Tabs
        variant="enclosed"
        size="md"
        isFitted
        index={activeTabIndex}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            Edit User Group
          </Tab>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            User Group Members
          </Tab>
          <Tab
            color={"white"}
            fontSize={["sm", "sm", "md"]}
            _selected={{ color: "white", bg: "#FFFFFF44" }}
          >
            Team Group Members
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SurveyComponent
              surveyJson={userGroupJson}
              endpoint={`/userGroup/${userGroupId}`}
              isNew={false}
              dataset={userGroupData}
              sjsPath="admin"
              reloadPageOnSuccess={true}
            />
          </TabPanel>
          <TabPanel p={0}>
            <DraggableGridsComponent
              populationData={userPopulationData}
              populationTitle="Users"
              sampleData={userSampleData}
              sampleTitle="Users in group"
              endpoint={`/api/userGroup/many/${userGroupId}`}
              fieldDefs={userFieldDefs}
              dynamicIdField="id"
              mappingField="userId"
              payloadKey="users"
              submitTitle={"Save Users"}
            />
          </TabPanel>
          <TabPanel p={0}>
            <DraggableGridsComponent
              populationData={teamPopulationData}
              populationTitle="Teams"
              sampleData={teamSampleData}
              sampleTitle="Teams in group"
              endpoint={`/api/userGroup/many/${userGroupId}`}
              fieldDefs={teamFieldDefs}
              dynamicIdField="id"
              mappingField="teamId"
              payloadKey="teams"
              submitTitle={"Save Teams"}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Confirmation Modal */}
      <SurveyModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmTabChange}
        title="Unsaved Changes"
        bodyContent="You may have unsaved changes. Are you sure you want to move tabs?"
        confirmLabel="Yes, Proceed"
        cancelLabel="Stay"
      />
    </>
  );
};

export default UserGroupsTabs;
