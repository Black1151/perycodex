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
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { useUser } from "@/providers/UserProvider";
import WarningIcon from "@mui/icons-material/Warning";
import BackButton from "@/components/BackButton";

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
    setLoading(true);
    getSubscription().finally(() => setLoading(false));
  }, [basket]);

  if (loading) {
    return (<Spinner/>);
  }

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
          Add some tools or user licenses to get started.
        </Text>
        <HStack spacing={1} fontSize="md" align="center" mt={4}>
          <Button onClick={() => router.push("/tool-store")}>
            Browse Tools
          </Button>
          <Button
            onClick={() => router.push("/tool-store/manage-subscription")}
          >
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
            fontSize={[24, 24, 32, 42]}
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

              <VStack spacing={0}>
                <HStack spacing={1} align="baseline">
                  <Text fontSize={[16, 18, 20]} fontWeight="semibold">
                    £{Number(item.itemGrandTotal).toFixed(2)}
                  </Text>
                  <Text fontSize={[12, 14, 16]} color="gray.500">
                    {subscription.isAnnual ? "/year" : "/month"}
                  </Text>
                </HStack>
                <Text fontSize={[14, 16]} color="gray.500">
                  £{(Number(item.itemGrandTotal) * 1.2).toFixed(2)}(incl. VAT)
                </Text>
              </VStack>
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
          {/* 2-column grid for Subtotal, Discounts, VAT, Total */}
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
                isNegative: true,
              },
              {
                label: "VAT",
                value: subscription.totals.taxTotal,
                isCurrency: true,
              },
              {
                label: "Total",
                value: subscription.totals.grandTotal,
                isCurrency: true,
              },
            ].map(({ label, value, isCurrency, isNegative }) => (
              <Box
                key={label}
                borderBottom="inset"
                borderColor="gray.200"
                gridColumn="1 / span 2"
                display="contents"
              >
                <Text fontWeight="medium" color="gray.600">
                  {subscription.isAnnual ? "Annual " : "Monthly "}
                  {label}
                </Text>
                <Flex align="baseline" justify="flex-end">
                  <Text
                    fontSize={[16, 18, 20]}
                    fontWeight="semibold"
                    color={isNegative ? "green.600" : undefined}
                  >
                    {isNegative ? "-" : ""}
                    {isCurrency ? "£" : ""}
                    {Number(value).toFixed(2)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>

          {/* Dates & licenses */}
            <Stack
            spacing={2}
            mb={6}
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            shouldWrapChildren
            >
            <Badge colorScheme="blue">
              Start Date:{" "}
              {new Date(subscription.updatedAt).toLocaleDateString("en-GB")}
            </Badge>
            {/* //TODO: Add renewal date in from db when col is made */}
            <Badge colorScheme="blue">Renewal Date: XX/XX/XXXX</Badge>
            <Badge colorScheme="blue">Subscription ID: {subscription.id}</Badge>
            </Stack>

          {/* Action buttons */}
          <Stack direction={{ base: "column", md: "row" }} spacing={3}>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Invoice
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Manage Subscription
            </Button>
            <Button
              variant="outline"
              disabled
              colorScheme="blue"
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Past Subscriptions
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => router.push("/tool-store/manage-subscription")}
            >
              Contact Sales
            </Button>
          </Stack>
        </Box>
      </Flex>
    </VStack>
  );
}
