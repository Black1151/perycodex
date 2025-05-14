"use client";

import React, { use, useEffect, useState } from "react";
import { useBasket, BasketItem, ToolConfig } from "../useBasket";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  VStack,
  Text,
  Spinner,
  Badge,
  useToast,
  useTheme,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";

export default function BasketPage() {
  const { basket, clearBasket, updateBasket, removeItemFromBasket, changeLicenseCount } =
    useBasket();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const theme = useTheme();

  const borderColor = "rgb(255, 255, 255, 0.65)";
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const cardBgLighter = theme.colors.elementBG;
  const textColor = theme.colors.primaryTextColor;
  const addBtnBg = transparentize(theme.colors.seduloGreen, 0.3)(theme);
  const addBtnHoverBg = transparentize(theme.colors.seduloGreen, 0.5)(theme);
  const removeBtnBg = "rgb(255, 0, 0, 0.3)";
  const removeBtnHoverBg = "rgb(255, 0, 0, 0.5)";

  // Track IDs of items being removed
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const newItems: BasketItem[] = React.useMemo(() => {
    setLoading(true);
    if (!basket) return [];
    return Array.isArray(basket.content)
      ? basket.content.filter(
          (item): item is BasketItem => "basketUniqueId" in item
        )
      : [];
  }, [basket]);

  const oldItems: ToolConfig[] = React.useMemo(() => {
    setLoading(true);
    if (!basket) return [];
    return Array.isArray(basket.content)
      ? basket.content.filter((item): item is ToolConfig => "name" in item)
      : [];
  }, [basket]);

  useEffect(() => {
    if (basket) {
      setLoading(false);
    }
  }, [basket]);

  useEffect(() => {
    if (basket) {
      setNewQuantity(basket.licensedUsers);
    }
  }, [basket?.licensedUsers]);

  if (basket?.licensedUsers === undefined) {
    return null;
  }

  const handleRemove = async (uniqueId: string) => {
    setRemovingIds((prev) => new Set(prev).add(uniqueId));
    try {
      await removeItemFromBasket(uniqueId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(uniqueId);
        return next;
      });
    }
  };

  const handleClearBasket = async () => {
    setLoading(true);
    try {
      await clearBasket();
      toast({
        title: "Basket cleared",
        description: "Your basket has been cleared.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear basket.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={0} align="center" justify="center" w="100%">
      {/* Header */}
      <Flex
        flexDirection={["column", "column", "row"]}
        gap={2}
        w="100%"
        p={[2, 4]}
        align="left"
        justify="space-between"
      >
        <Flex
          gap={0}
          width="100%"
          justify={["center", "center", "space-between"]}
          flexDirection="row"
        >
          <Text
            fontWeight="400"
            fontFamily="bonfire"
            fontSize={[32, 42]}
            color={theme.colors.elementBG}
          >
            Your Perygon Subscription
          </Text>
          <BillingCycleToggle />
        </Flex>
      </Flex>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        w="100%"
        p={[2, 4]}
      >
        {/* LEFT: product list */}
        <Stack flex="1" spacing={6}>
          {/* License block */}
          <Flex
            bg={cardBgLighter}
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            align="center"
            justify="space-between"
          >
            <HStack spacing={4}>
              <Box>
                <HStack spacing={1} fontSize="24">
                  <AnimatedTillNumber
                    value={basket.quantity || basket.licensedUsers}
                    fontSize="24"
                    duration={0.65}
                  />
                  <Text fontWeight="bold" fontSize={24}>
                    Total Licenses
                  </Text>
                </HStack>
                <Text fontSize={15} color="gray.500">
                  {basket.licensedUsers} Already Purchased Licenses
                </Text>
              </Box>
            </HStack>
            <HStack align="flex-end" spacing={2}>
              <Button
                variant="outline"
                onClick={() => changeLicenseCount(20, false)}
                size="lg"
              >
                +20
              </Button>
              <Button
                variant="outline"
                onClick={() => changeLicenseCount(20, true)}
                size="lg"
              >
                –20
              </Button>
            </HStack>
          </Flex>

          {/* Old Items Product list */}
          {oldItems.length > 0 &&
            oldItems.map((item) => {
              const removing = removingIds.has(item.uniqueId);
              return (
                <Flex
                  key={item.uniqueId || item.id}
                  borderRadius="md"
                  boxShadow="sm"
                  p={4}
                  align="center"
                  justify="space-between"
                  bg={cardBg}
                >
                  <HStack spacing={4}>
                    {item.iconImageUrl && (
                      <Image
                        src={item.iconImageUrl}
                        boxSize="80px"
                        objectFit="contain"
                      />
                    )}
                    <Box>
                      <Text
                        fontWeight="bold"
                        noOfLines={2}
                        fontSize={24}
                        cursor="pointer"
                      >
                        {item.displayName}
                      </Text>
                      <HStack spacing={1} fontSize="md">
                        <AnimatedTillNumber
                          value={basket.licensedUsers}
                          fontSize="md"
                          duration={0.65}
                        />
                        <Text fontWeight="normal" noOfLines={2}>
                          Licenses
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>

                  <Button
                    variant="outline"
                  >
                    Launch Tool
                  </Button>

                  {/* <VStack align="flex-end" spacing={2}>
                    <HStack spacing={4}>
                      <HStack spacing={1} fontSize="24">
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          textDecoration="line-through"
                        >
                          £
                        </Text>
                        <AnimatedTillNumber
                          value={item.Subtotal}
                          fontSize="sm"
                          duration={0.65}
                          color="gray.500"
                          textDecoration="line-through"
                        />
                      </HStack>
                      <HStack spacing={1} fontSize="lg">
                        <Text fontWeight="bold">£</Text>
                        <AnimatedTillNumber
                          value={item.itemGrandTotal}
                          fontSize="lg"
                          duration={0.65}
                        />
                      </HStack>
                      <IconButton
                        aria-label="Remove item"
                        icon={removing ? <Spinner size="sm" /> : <FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(item.uniqueId)}
                        isDisabled={removing}
                      />
                    </HStack>
                    <HStack>
                      {item.discounts.map((discount) => (
                        <Badge
                          key={discount.uniqueId}
                          colorScheme="green"
                          fontSize="0.8em"
                          mr={1}
                        >
                          {discount.name}
                        </Badge>
                      ))}
                    </HStack>
                  </VStack> */}
                </Flex>
              );
            })}

          {/* New/UpdatedQuantity Items Product list */}
          {newItems.length === 0 ? (
            <Box p={6} bg={cardBg} borderRadius="md" boxShadow="sm">
              <Text>You have no changes made to your subscription</Text>
            </Box>
          ) : (
            newItems.map((item) => {
              const removing = removingIds.has(item.uniqueId);
              return (
                <Flex
                  key={item.uniqueId || item.id}
                  borderRadius="md"
                  boxShadow="sm"
                  p={4}
                  align="center"
                  justify="space-between"
                  bg={cardBg}
                >
                  <HStack spacing={4}>
                    {item.toolConfig?.iconImageUrl && (
                      <Image
                        src={item.toolConfig.iconImageUrl}
                        boxSize="80px"
                        objectFit="contain"
                      />
                    )}
                    <Box>
                      <HStack spacing={1}>
                        <Text
                          fontWeight="bold"
                          noOfLines={2}
                          fontSize={24}
                          onClick={() =>
                            window.open(
                              `/tool-store/${item.toolConfigUniqueId}`,
                              "_blank"
                            )
                          }
                          cursor="pointer"
                        >
                          {item.toolConfig.displayName}
                        </Text>
                        {!basket.ownedSubscriptionInfo?.some(
                          (ownedItem) =>
                            ownedItem.uniqueId === item.toolConfigUniqueId
                        ) && (
                          <Badge
                            colorScheme="green"
                            fontSize="0.8em"
                            ml={1}
                            mr={1}
                          >
                            New!
                          </Badge>
                        )}
                      </HStack>
                      <HStack spacing={1} fontSize="md">
                        <AnimatedTillNumber
                          value={basket.quantity}
                          fontSize="md"
                          duration={0.65}
                        />
                        <Text fontWeight="normal" noOfLines={2}>
                          Licenses
                        </Text>
                        <Badge colorScheme="blue">+{item.quantity} New Licenses</Badge>
                      </HStack>
                    </Box>
                  </HStack>

                  <VStack align="flex-end" spacing={2}>
                    <HStack spacing={4}>
                      <HStack spacing={1} fontSize="24">
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          textDecoration="line-through"
                        >
                          £
                        </Text>
                        <AnimatedTillNumber
                          value={item.itemSubtotal}
                          fontSize="sm"
                          duration={0.65}
                          color="gray.500"
                          textDecoration="line-through"
                        />
                      </HStack>
                      <HStack spacing={1} fontSize="lg">
                        <Text fontWeight="bold">£</Text>
                        <AnimatedTillNumber
                          value={item.itemGrandTotal}
                          fontSize="lg"
                          duration={0.65}
                        />
                      </HStack>
                      <IconButton
                        aria-label="Remove item"
                        icon={removing ? <Spinner size="sm" /> : <FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(item.uniqueId)}
                        isDisabled={removing}
                      />
                    </HStack>
                    <HStack>
                      {item.discounts.map((discount) => (
                        <Badge
                          key={discount.uniqueId}
                          colorScheme="green"
                          fontSize="0.8em"
                          mr={1}
                        >
                          {discount.name}
                        </Badge>
                      ))}
                    </HStack>
                  </VStack>
                </Flex>
              );
            })
          )}
        </Stack>

        {/* RIGHT: order summary - only shown when there is a totals */}
        {basket.totals && (
          <Box
            w={{ base: "100%", md: "320px" }}
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            p={6}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontSize="lg">Your Order</Text>
              <Text color="gray.500">
                {newItems.length + oldItems.length} items
              </Text>
            </HStack>

            <Stack spacing={2} mb={4}>
              <HStack justify="space-between">
                <Text>Basket Total</Text>
                <HStack spacing={1} fontSize="md">
                  <Text>£</Text>
                  <AnimatedTillNumber
                    value={parseFloat(basket.totals.subtotal)}
                    fontSize="md"
                    duration={0.65}
                  />
                </HStack>
              </HStack>
              <HStack justify="space-between">
                <Text>Total Discount</Text>
                <HStack spacing={1} fontSize="md">
                  <Text color="green.500">–£</Text>
                  <AnimatedTillNumber
                    value={parseFloat(basket.totals.discountsTotal)}
                    fontSize="md"
                    duration={0.65}
                    color="green.500"
                  />
                </HStack>
              </HStack>
              <HStack justify="space-between">
                <Text>Tax</Text>
                <HStack spacing={1} fontSize="md">
                  <Text>£</Text>
                  <AnimatedTillNumber
                    value={parseFloat(basket.totals.taxTotal)}
                    fontSize="md"
                    duration={0.65}
                  />
                </HStack>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Total</Text>
                <HStack spacing={1} fontSize="lg">
                  <Text fontWeight="bold">£</Text>
                  <AnimatedTillNumber
                    value={parseFloat(basket.totals.grandTotal)}
                    fontSize="lg"
                    duration={0.65}
                  />
                </HStack>
              </HStack>
            </Stack>

            <Button
              colorScheme="brand"
              w="full"
              mb={3}
              onClick={() => router.push("/checkout")}
            >
              Checkout
            </Button>
            <Button variant="outline" w="full" onClick={handleClearBasket}>
              Clear Changes
            </Button>
          </Box>
        )}
      </Flex>
    </VStack>
  );
}
