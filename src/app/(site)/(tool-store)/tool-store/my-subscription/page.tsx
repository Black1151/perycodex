"use client";

import React, { useEffect, useState } from "react";
import { BasketItem, useBasket, ToolConfig } from "../useBasket";
import {
  Flex,
  Text,
  Box,
  HStack,
  VStack,
  Button,
  Stack,
  useTheme,
  Image,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { useUser } from "@/providers/UserProvider";
import WarningIcon from "@mui/icons-material/Warning";

function isBasketItem(item: BasketItem | ToolConfig): item is BasketItem {
  return (item as BasketItem).basketUniqueId !== undefined;
}
function isToolConfig(item: BasketItem | ToolConfig): item is ToolConfig {
  return (
    (item as ToolConfig).id !== undefined &&
    !(item as BasketItem).basketUniqueId
  );
}

export default function CurrentSubscriptionPage() {
  const { subscription, getSubscription, basket } = useBasket();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const user = useUser();
  const router = useRouter();

  const borderColor = "rgba(255, 255, 255, 0.65)";
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const cardBgLighter = theme.colors.elementBG;

  useEffect(() => {
    if (subscription) {
      setLoading(false);
    } else {
      getSubscription();
    }
  }, [subscription, basket, getSubscription]);

  // don’t render until we know how many licenses we have
  if (subscription?.licensedUsers === undefined) {
    return null;
  }

  // Narrow out only the BasketItem entries from the mixed content array
  const basketItems = subscription.content.filter(
    (item): item is BasketItem =>
      (item as BasketItem).basketUniqueId !== undefined
  );

  return (
    <VStack spacing={0} align="center" justify="center" w="100%">
      {/* Header */}
      <Flex
        flexDirection={["column", "row"]}
        gap={2}
        w="100%"
        p={0}
        align="flex-start"
        justify="space-between"
        mb={4}
      >
        <Text
          fontWeight="400"
          color={theme.colors.elementBG}
          fontFamily="bonfire"
          fontSize={[32, 32, 42]}
        >
          My Current Subscription
        </Text>
        <BillingCycleToggle />
      </Flex>

      {user.user?.customerIsFree ? (
        <VStack
          spacing={2}
          align="center"
          justify="center"
          w="100%"
          h="70vh"
          fontSize={[20, 20, 22, 24]}
          color={theme.colors.elementBG}
        >
          <WarningIcon color="inherit" fontSize="large" />
          <Text fontWeight="400">
            You don’t have an active paid subscription.
          </Text>
          <Text fontWeight="400" fontSize={[14, 14, 16, 18]}>
            Add some tools or licenses to get started.
          </Text>
          <Button onClick={() => router.push("/tool-store")} mt={4}>
            Tool Store
          </Button>
        </VStack>
      ) : (
        <Flex
          direction={{ base: "column-reverse", lg: "row" }}
          gap={4}
          w="100%"
        >
          {/* LEFT: product list */}
          <Stack flex="1" spacing={4}>

            {subscription.content.map((item) =>
              isBasketItem(item) ? (
                // --- BasketItem row ---
                <HStack
                  key={item.uniqueId}
                  bg={cardBg}
                  borderColor={borderColor}
                  borderRadius="md"
                  boxShadow="sm"
                  p={4}
                  justify="space-between"
                  align="center"
                  spacing={4}
                >
                  {/* Icon, name, description */}
                  <HStack spacing={4} flex="1">
                    {item.toolConfig.iconImageUrl && (
                      <Image
                        src={item.toolConfig.iconImageUrl}
                        alt={item.toolConfig.name}
                        boxSize="80px"
                        borderRadius="md"
                      />
                    )}
                    <VStack align="flex-start" spacing={0} flex="1">
                      <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                        {item.toolConfig.displayName}
                      </Text>
                      <Text fontSize={[14, 16]} color="gray.500">
                        {subscription.licensedUsers} licenses 
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Price and cycle */}
                  <HStack spacing={1} align="baseline">
                    <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                      £{item.itemGrandTotal}
                    </Text>
                    <Text fontSize={[12, 14, 16]} color="gray.500">
                      {subscription.isAnnual ? "/year" : "/month"}
                    </Text>
                  </HStack>
                </HStack>
              ) : (
                // --- ToolConfig row (owned subscription info) ---
                <HStack
                  key={`config-${item.id}`}
                  bg={cardBgLighter}
                  borderColor={borderColor}
                  borderRadius="md"
                  boxShadow="sm"
                  p={4}
                  justify="space-between"
                  align="center"
                  spacing={4}
                >
                  <HStack spacing={4} flex="1">
                    {item.iconImageUrl && (
                      <Image
                        src={item.iconImageUrl}
                        alt={item.displayName}
                        boxSize="50px"
                        borderRadius="md"
                      />
                    )}
                    <VStack align="flex-start" spacing={0} flex="1">
                      <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                        {item.displayName}
                      </Text>
                      <Text fontSize={[14, 16]} color="gray.500">
                        {subscription.licensedUsers} licenses
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Owned‐subscription items don’t have a per‐item total,
            but you could show their monthly/annual price: */}
                  <HStack spacing={1} align="baseline">
                    <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                      £
                      {subscription.isAnnual
                        ? item.annualPrice
                        : item.monthlyPrice}
                    </Text>
                    <Text fontSize={[12, 14, 16]} color="gray.500">
                      {subscription.isAnnual ? "/year" : "/month"}
                    </Text>
                  </HStack>
                </HStack>
              )
            )}
          </Stack>
        </Flex>
      )}
    </VStack>
  );
}
