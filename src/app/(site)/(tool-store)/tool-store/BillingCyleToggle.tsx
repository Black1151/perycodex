"use client";

import React, { FC, useState } from "react";
import { useBasket } from "./useBasket";
import {
  Tabs,
  TabList,
  Tab,
  Badge,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";

const BillingCycleToggle: FC = () => {
  const { basket, loading, updateBasket } = useBasket();
  const [isSaving, setIsSaving] = useState(false);
  const user = useUser();
  const isUserFree = user?.user?.customerIsFree;

  // default to monthly if basket or flag is missing
  const isAnnual = Boolean(basket?.isAnnual);

  const handleChange = async (index: number) => {
    const wantAnnual = index === 1;
    if (wantAnnual === isAnnual) return;

    setIsSaving(true);
    try {
      await updateBasket({ isAnnual: wantAnnual });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs
      index={isAnnual ? 1 : 0}
      onChange={handleChange}
      variant="line"
      isFitted
      borderRadius={"full"}
    >
      <TabList borderRadius={"full"}>
        <Tab
          isDisabled={loading || isSaving || !isUserFree}
          borderRadius={"full"}
          borderWidth={1}
        >
          <Flex align="center" justify="center">
            <Text fontSize={["xs", "sm", "md"]}>Monthly</Text>
            {isSaving && isAnnual && <Spinner size="xs" ml={2} />}
          </Flex>
        </Tab>
        <Tab
          isDisabled={loading || isSaving || !isUserFree}
          borderRadius={"full"}
          borderWidth={1}
        >
          <Flex align="center" justify="center">
            <Text fontSize={["xs", "sm", "md"]}>Annual</Text>
            {basket?.annualDiscountPercent && (
              <Badge ml={2} fontSize="xs" colorScheme="green">
                SAVE {basket?.annualDiscountPercent}%
              </Badge>
            )}
            {isSaving && !isAnnual && <Spinner size="xs" ml={2} />}
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};

export default BillingCycleToggle;
