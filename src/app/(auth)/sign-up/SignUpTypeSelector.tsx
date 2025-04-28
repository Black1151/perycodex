"use client";

import { Tabs, TabList, Tab, useTheme } from "@chakra-ui/react";
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

interface SignUpTypeSelectorProps {
  signUpType: "individual" | "company";
  setSignUpType: (type: "individual" | "company") => void;
}

export const SignUpTypeSelector = ({
  signUpType,
  setSignUpType,
}: SignUpTypeSelectorProps) => {
  // Map your signUpType to a 0|1 index
  const tabIndex = signUpType === "company" ? 1 : 0;
  const theme = useTheme();

  return (
    <Tabs
      index={tabIndex}
      onChange={(idx) => setSignUpType(idx === 0 ? "individual" : "company")}
      variant="outline"
      mb={6}
      w="full"
    >
      <TabList
        bg={theme.colors.elementBG}
        borderRadius="lg"
        gap={2}
      >
        <Tab flex={1} borderRadius="lg" _selected={{ bg: theme.colors.primary, color: "white" }} _focus={{ boxShadow: "none" }} background={"white"}>
          <BusinessIcon style={{ marginRight: "4px" }} />
          Join existing company
        </Tab>
        <Tab flex={1} borderRadius="lg" _selected={{ bg: theme.colors.primary, color: "white" }} _focus={{ boxShadow: "none" }} background={"white"}>
          <PersonIcon style={{ marginRight: "4px" }} />
          Register new company
        </Tab>
      </TabList>
    </Tabs>
  );
};
