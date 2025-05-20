"use client";

import React, { use, useEffect, useState } from "react";
import {
  useBasket,
  BasketItem,
  ToolConfig,
  SubscriptionInfo,
} from "../useBasket";
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
  Badge,
} from "@chakra-ui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { transparentize } from "@chakra-ui/theme-tools";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import BillingCycleToggle from "../BillingCyleToggle";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import BasketItemCard from "./BasketItemCard";
import BackButton from "@/components/BackButton";
import { Close } from "@mui/icons-material";
import ToolSelectedIndicators from "./ToolSelectedIndicators";
import WarningIcon from "@mui/icons-material/Warning";
import LicenseAmountIndicator from "./LicenseAmountIndicator";
import { subscriptionLimits } from "@/utils/constants/subscriptionLimits";
import { PerygonModal } from "@/components/modals/PerygonModal";
import { set } from "lodash";
import ToolInfoCard from "./ToolInfoCard";

export default function BasketPage() {
  const {
    basket,
    clearBasket,
    updateBasket,
    removeItemFromBasket,
    changeLicenseCount,
    getBasket,
    error,
    addVoucher,
  } = useBasket();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [addingVoucher, setAddingVoucher] = useState(false);
  const [salesModalOpen, setSalesModalOpen] = useState(false);

  const theme = useTheme();

  const borderColor = transparentize(
    theme.colors.primaryTextColor,
    0.25
  )(theme);
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const cardBgLighter = theme.colors.elementBG;

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

  const oldItems: SubscriptionInfo[] = React.useMemo(() => {
    setLoading(true);
    if (!basket) return [];
    return Array.isArray(basket.ownedSubscriptionInfo)
      ? basket.ownedSubscriptionInfo.filter(
          (item): item is SubscriptionInfo => "name" in item
        )
      : [];
  }, [basket]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load basket. Please reload the page.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/basket/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create basket.");
      }
      toast({
        title: "Checkout successful",
        description: "Your checkout was successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      getBasket();
      router.push("/tool-store/my-subscription");
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
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
      <PerygonModal
        title="Please Contact Sales"
        isOpen={salesModalOpen}
        onClose={() => setSalesModalOpen(false)}
        body={
          <VStack spacing={4} align="center" justify="center">
            <Text color={theme.colors.primaryTextColor}>
              To reduce your license count, please contact our sales team.
            </Text>
            <HStack spacing={2} align="center">
              {/* //TODO: Add a link to the sales team contact page */}
              <Button mt={4} colorScheme="brand">
                Contact Sales
              </Button>
              <Button
                mt={4}
                colorScheme="brand"
                onClick={() => setSalesModalOpen(false)}
              >
                Close
              </Button>
            </HStack>
          </VStack>
        }
      >
        <></>
      </PerygonModal>

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
            Manage Subscription
          </Text>
        </HStack>
        <BillingCycleToggle />
      </Flex>

      {basket.totals ? (
        <Flex
          direction={{ base: "column-reverse", lg: "row" }}
          gap={4}
          w="100%"
        >
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
                      isCurrency={false}
                    />
                    <Text fontWeight="semibold" fontSize={[16, 18, 20, 20]}>
                      Total User Licenses
                    </Text>
                    {basket.quantity - basket.licensedUsers !== 0 &&
                      basket.totals && (
                        <Badge colorScheme="blue" fontSize="0.8em">
                          {" "}
                          + {basket.quantity - basket.licensedUsers}
                        </Badge>
                      )}
                  </HStack>
                  <Text fontSize={15} color="gray.500">
                    {basket.licensedUsers} Licenses Currently Subscribed
                  </Text>
                </Box>
              </HStack>
              <HStack align="flex-end" spacing={2}>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      basket.quantity == 0 ||
                      basket.licensedUsers == basket.quantity ||
                      basket.quantity == undefined
                    ) {
                      setSalesModalOpen(true);
                    } else {
                      changeLicenseCount(20, true);
                    }
                  }}
                  size="lg"
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
              oldItems
                .filter(
                  (item) =>
                    !newItems.some(
                      (newItem) =>
                        newItem.toolConfigUniqueId === item.uniqueId ||
                        newItem.id === item.id
                    )
                )
                .map((item) => {
                  return (
                    <ToolInfoCard
                      key={item.uniqueId}
                      info={item}
                      licensedUsers={basket.licensedUsers}
                      isNew={false}
                    />
                  );
                })}

            {/* New/UpdatedQuantity Items Product list */}
            {newItems.length === 0 ? (
              <Box p={6} bg={cardBg} borderRadius="md" boxShadow="sm">
                <Text>You have no changes made to your subscription</Text>
              </Box>
            ) : (
              newItems.map((item) => {
                const isNew = !oldItems.some(
                  (sub) => sub.id === item.toolConfig.id
                );
                return (
                  <BasketItemCard
                    key={item.uniqueId}
                    item={item}
                    licensedUsers={basket.quantity}
                    isNew={isNew}
                    removingIds={removingIds}
                    handleRemove={handleRemove}
                  />
                );
              })
            )}
          </Stack>

          <Box w={{ base: "100%", md: "100%", lg: "400px" }} gap={4}>
            {/* mobile header with chevron */}
            {isMobile && (
              <Flex
                align="center"
                justify="space-between"
                px={2}
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                p={4}
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
                    <Text>VAT</Text>
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
                  onClick={async () => {
                    const result = await handleCheckout();
                  }}
                  disabled={basket.quantity === 0}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  w="full"
                  onClick={handleClearBasket}
                  bg={"white"}
                  mb={3}
                >
                  Clear Changes
                </Button>
                <Button
                  variant={"outline"}
                  w="full"
                  onClick={() => setAddingVoucher((prev) => !prev)}
                >
                  Add Voucher Code
                </Button>
              </Box>
            </Collapse>

            <Collapse in={addingVoucher} animateOpacity>
              <Box
                bg={isMobile ? "rgba(255,255,255,0.85)" : "white"}
                borderRadius="lg"
                boxShadow="sm"
                p={6}
                mt={3}
              >
                {/* non-mobile header */}
                {!isMobile && (
                  <HStack justify="space-between" mb={4}>
                    <Text fontSize={[14, 16, 18]} fontWeight="semibold">
                      Add Voucher
                    </Text>
                    <IconButton
                      aria-label="Toggle summary"
                      icon={addingVoucher ? <Close /> : <></>}
                      onClick={() => setAddingVoucher((o) => !o)}
                      variant="ghost"
                      size="sm"
                    />
                  </HStack>
                )}

                {/* Add a voucher code from here */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem(
                      "voucher"
                    ) as HTMLInputElement;
                    const code = input.value.trim();
                    if (!code) {
                      toast({
                        title: "Please enter a voucher code.",
                        status: "warning",
                        duration: 2000,
                        isClosable: true,
                      });
                      return;
                    }
                    setLoading(true);
                    try {
                      addVoucher(code);
                      toast({
                        title: "Voucher applied!",
                        description: "Your voucher code has been applied.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description:
                          error instanceof Error
                            ? error.message
                            : "An unexpected error occurred.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Stack spacing={3} mb={3}>
                    <Text fontSize="sm" color="gray.600">
                      Enter your voucher code below:
                    </Text>
                    <HStack>
                      <input
                        name="voucher"
                        type="text"
                        placeholder="Voucher code"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "4px",
                          border: "1px solid #CBD5E0",
                          fontSize: "16px",
                        }}
                        disabled={loading}
                        autoComplete="off"
                      />
                      <Button
                        colorScheme="brand"
                        type="submit"
                        isLoading={loading}
                        disabled={loading}
                      >
                        Apply
                      </Button>
                    </HStack>
                  </Stack>
                </form>
              </Box>
            </Collapse>
          </Box>
        </Flex>
      ) : (
        <VStack spacing={4} w={"100%"}>
          <VStack
            spacing={2}
            align="center"
            justify="center"
            w="100%"
            fontSize={[20, 20, 22, 24]}
            color={theme.colors.elementBG}
            pb={8}
            pt={4}
          >
            <WarningIcon color="inherit" fontSize="large" />
            <Text fontWeight="400">
              You haven't made any changes to your subscription.
            </Text>
            <Text fontWeight="400" fontSize={[14, 14, 16, 18]}>
              Add some tools or user licenses to get started.
            </Text>
          </VStack>
          <Stack
            spacing={8}
            align="center"
            direction={{ base: "column", lg: "row" }}
            w={"100%"}
          >
            <VStack
              spacing={8}
              align="center"
              w="50%"
              bg={cardBg}
              borderRadius={"md"}
              p={4}
              minH={"300px"}
              justify={"center"}
            >
              {basket.licensedUsers === 0 ? (
                <VStack spacing={2}>
                  {/* Customer is free, show amount of free licenses they have */}
                  <HStack spacing={4}>
                    <Box>
                      <HStack spacing={2} fontSize={[14, 16, 18, 18]}>
                        <LicenseAmountIndicator
                          amount={subscriptionLimits.free.maxUsers}
                        />
                      </HStack>
                    </Box>
                  </HStack>
                  <HStack align="flex-end" spacing={2} justify={"center"}>
                    <AnimatedTillNumber
                      value={subscriptionLimits.free.maxUsers}
                      fontSize="32"
                      duration={0.65}
                      isCurrency={false}
                    />
                    <Text fontWeight="normal" fontSize={[14, 16, 18, 18]}>
                      Free Trial Licenses
                    </Text>
                  </HStack>
                </VStack>
              ) : (
                <HStack spacing={4}>
                  <Box>
                    <HStack spacing={2} fontSize={[14, 16, 18, 18]}>
                      <LicenseAmountIndicator amount={basket.licensedUsers} />
                    </HStack>
                  </Box>
                </HStack>
              )}
              <HStack align="flex-end" spacing={2} justify={"center"}>
                <Button
                  variant="outline"
                  onClick={() => setSalesModalOpen(true)}
                  size="sm"
                >
                  –20
                </Button>
                <AnimatedTillNumber
                  value={basket.licensedUsers}
                  fontSize="32"
                  duration={0.65}
                  isCurrency={false}
                />
                <Text fontWeight="normal" fontSize={[14, 16, 18, 18]}>
                  {basket.licensedUsers === 0 && "Paid "}Licenses
                </Text>
                <Button
                  variant="outline"
                  onClick={() => changeLicenseCount(20, false)}
                  size="sm"
                >
                  +20
                </Button>
              </HStack>
            </VStack>

            <VStack
              spacing={2}
              align="center"
              w="50%"
              bg={cardBg}
              borderRadius={"md"}
              p={4}
              minH={"300px"}
              justify={"center"}
            >
              <ToolSelectedIndicators
                subscriptionInfo={basket.ownedSubscriptionInfo}
              />
              <Button
                colorScheme="brand"
                onClick={() => router.push("/tool-store")}
              >
                Browse Tools
              </Button>
            </VStack>
          </Stack>
        </VStack>
      )}
    </VStack>
  );
}
