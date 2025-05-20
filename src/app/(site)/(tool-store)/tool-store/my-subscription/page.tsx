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
  SimpleGrid,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { useUser } from "@/providers/UserProvider";
import WarningIcon from "@mui/icons-material/Warning";
import BackButton from "@/components/BackButton";

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
  const [noSubscription, setNoSubscription] = useState(true);
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
  }, [subscription, basket]);

  // don’t render until we know how many licenses we have
  if (subscription && subscription?.licensedUsers === undefined) {
    return null;
  }

  if (!subscription) {
    return (
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
        <HStack spacing={1} fontSize="md" align="center" mt={4}>
          <Button onClick={() => router.push("/tool-store")}>
            Browse Tools
          </Button>
          <Button onClick={() => router.push("/manage-subscription")}>
            Add Licenses
          </Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack spacing={0} align="center" justify="center" w="100%">
      {/* Header */}
      <Flex
        flexDirection={["column", "row", "row"]}
        gap={2}
        w="100%"
        p={0}
        align="left"
        justify="space-between"
        mb={4}
      >
        <HStack spacing={1} align={"center"}>
          <BackButton />
          <Text
            fontWeight="400"
            color={theme.colors.elementBG}
            fontFamily="bonfire"
            fontSize={[32, 42]}
            mb={-3}
          >
            My Current Subscription
          </Text>
        </HStack>
        <BillingCycleToggle />
      </Flex>

      <Flex
        direction={{ base: "column-reverse", lg: "column" }}
        gap={4}
        w="100%"
      >
        <Stack flex="1" spacing={4}>
          {subscription.ownedSubscriptionInfo.map((item) => (
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
                  £{item.itemGrandTotal}
                </Text>
                <Text fontSize={[12, 14, 16]} color="gray.500">
                  {subscription.isAnnual ? "/year" : "/month"}
                </Text>
              </HStack>
            </HStack>
          ))}
        </Stack>
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="sm"
          p={6}
          flex="1"
        >
          {/* 2-column grid for Subtotal, Discounts, Tax, Total */}
          <SimpleGrid columns={2} spacingY={4} spacingX={6} mb={6} w="100%">
            {[
              {
                label: "Subtotal",
                value: subscription.totals.subtotal,
                isCurrency: true,
              },
              {
                label: "Discounts",
                value: subscription.totals.discountsTotal,
                isCurrency: true,
              },
              {
                label: "Tax",
                value: subscription.totals.taxTotal,
                isCurrency: true,
              },
              {
                label: "Total",
                value: subscription.totals.grandTotal,
                isCurrency: true,
              },
            ].map(({ label, value, isCurrency }) => (
              <Box
                key={label}
                borderBottom="inset"
                borderColor="gray.200"
                gridColumn="1 / span 2"
                display="contents"
              >
                <Text fontWeight="medium" color="gray.600">
                  {label}
                </Text>
                <Flex align="baseline" justify="flex-end">
                  <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                    {isCurrency ? "£" : ""}
                    {Number(value)}
                  </Text>
                  {isCurrency && (
                    <Text fontSize={[12, 14, 16]} color="gray.500">
                      {subscription.isAnnual ? "/year" : "/month"}
                    </Text>
                  )}
                </Flex>
              </Box>
            ))}
          </SimpleGrid>

          {/* Dates & licenses */}
          <Stack spacing={2} mb={6} direction={"row"}>
            <Text fontSize="sm" color="gray.500">
              {new Date(subscription.updatedAt).toLocaleDateString("en-GB")}
            </Text>
          </Stack>

          {/* Action buttons */}
          <Stack direction={{ base: "column", md: "row" }} spacing={3}>
            <Button
              variant="outline"
              colorScheme="blue"
              flex={1}
              onClick={() => router.push("/manage-subscription")}
            >
              Invoice
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              flex={1}
              onClick={() => router.push("/manage-subscription")}
            >
              Manage Subscription
            </Button>
            <Button
              variant="outline"
              disabled
              colorScheme="blue"
              flex={1}
              onClick={() => router.push("/manage-subscription")}
            >
              Past Subscriptions
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              flex={1}
              onClick={() => router.push("/manage-subscription")}
            >
              Contact Sales
            </Button>
          </Stack>
        </Box>
      </Flex>
    </VStack>
  );
}
