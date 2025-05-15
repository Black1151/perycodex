"use client";

import React, { use, useEffect, useState } from "react";
import { useBasket, BasketItem, ToolConfig } from "../useBasket";
import {
  Collapse,
  useBreakpointValue,
  IconButton,
  Flex,
  Text,
  Box,
  HStack,
  VStack,
  Button,
  Stack,
  useTheme,
  useToast,
  Image,
} from "@chakra-ui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { transparentize } from "@chakra-ui/theme-tools";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import BasketItemCard from "./BasketItemCard";

export default function BasketPage() {
  const {
    basket,
    clearBasket,
    updateBasket,
    removeItemFromBasket,
    changeLicenseCount,
    getBasket,
  } = useBasket();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const theme = useTheme();

  const borderColor = "rgb(255, 255, 255, 0.65)";
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const cardBgLighter = theme.colors.elementBG;

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
    } else {
      getBasket();
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
        flexDirection={["column", "row", "row"]}
        gap={2}
        w="100%"
        p={0}
        align="left"
        justify="space-between"
        mb={4}
      >
        <Text
          fontWeight="400"
          color={theme.colors.elementBG}
          fontFamily="bonfire"
          fontSize={[32, 32, 42]}
        >
          Manage Subscription
        </Text>
        <BillingCycleToggle />
      </Flex>

      <Flex direction={{ base: "column-reverse", lg: "row" }} gap={4} w="100%">
        {/* LEFT: product list */}
        <Stack flex="1" spacing={4}>
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
                <HStack spacing={2} fontSize={[16, 18, 20, 20]}>
                  <AnimatedTillNumber
                    value={basket.quantity || basket.licensedUsers}
                    fontSize="24"
                    duration={0.65}
                  />
                  <Text fontWeight="semibold" fontSize={[16, 18, 20, 20]}>
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
                onClick={() => changeLicenseCount(20, true)}
                size="lg"
                disabled={basket.quantity < basket.licensedUsers + 20}
              >
                –20
              </Button>
              <Button
                variant="outline"
                onClick={() => changeLicenseCount(20, false)}
                size="lg"
              >
                +20
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
                    <Box p={4}>
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

                  <Button variant="outline">Launch Tool</Button>

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
                <BasketItemCard
                  key={item.uniqueId}
                  item={item}
                  licensedUsers={basket.quantity}
                  isNew={true}
                  removingIds={removingIds}
                  handleRemove={handleRemove}
                />
              );
            })
          )}
        </Stack>

        {/* RIGHT: order summary - only shown when there is a totals */}
        {basket.totals && (
          <Box w={{ base: "100%", md: "100%", lg: "400px" }}>
            {/* mobile header with chevron */}
            {isMobile && (
                <Flex
                align="center"
                justify="space-between"
                px={2}
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                p={6}
                mb={isSummaryOpen ? 1 : 0}
                >
                <Text fontSize={[16, 18, 20, 22]} fontWeight="semibold">
                  Subscription Totals
                </Text>
                <IconButton
                  aria-label="Toggle summary"
                  icon={isSummaryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setSummaryOpen((o) => !o)}
                  variant="ghost"
                  size="sm"
                />
                </Flex>
            )}

            <Collapse in={!isMobile || isSummaryOpen} animateOpacity>
              <Box
                bg={isMobile ? "rgba(255,255,255,0.85)" : "white"}
                borderRadius="lg"
                boxShadow="sm"
                p={6}
              >
                {/* non-mobile header */}
                {!isMobile && (
                  <HStack justify="space-between" mb={4}>
                    <Text fontSize={[14, 16, 18]} fontWeight="semibold">
                      Subscription Totals
                    </Text>
                  </HStack>
                )}

                <Stack spacing={2} mb={4}>
                  <HStack justify="space-between">
                    <Text>{basket.isAnnual ? "Yearly" : "Monthly"} Total</Text>
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
                      <Text fontWeight="bold">
                        {basket.isAnnual ? "/year" : "/mo"}
                      </Text>
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
                <Button variant="outline" w="full" onClick={handleClearBasket} bg={"white"}>
                  Clear Changes
                </Button>
              </Box>
            </Collapse>
          </Box>
        )}
      </Flex>
    </VStack>
  );
}
