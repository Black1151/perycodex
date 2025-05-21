"use client";

import React, { useRef, useEffect, useState } from "react";
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
import LicensePicker from "../LicensePicker";
import BillingAddressForm, {
  BillingAddressFormHandle,
} from "./BillingAddressForm";
import { Spinner } from "@chakra-ui/react";

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [addingVoucher, setAddingVoucher] = useState(false);
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const billingRef = useRef<BillingAddressFormHandle>(null);

  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 1)(theme);

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
    setCheckoutLoading(true);

    const addr = billingRef.current?.getAddress();
    if (!addr) {
      toast({
        title: "Error",
        description: "Please fill in your billing address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setCheckoutLoading(false);
      return;
    }

    const payload = {
      address: {
        line1: addr.address1,
        city: addr.city,
        postalCode: addr.postcode,
        country: addr.country,
      },
    };

    try {
      const response = await fetch("/api/basket/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create basket.");
      }

      const redirectUrl = data?.resource?.original?.redirectUrl;
      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      } else {
        toast({
          title: "Error",
          description: "No redirect URL received from server.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

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
      setCheckoutLoading(false);
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
          <Stack flex="1" spacing={4}>
            {/* License block */}
            <LicensePicker />

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
                    handleCheckout();
                  }}
                  disabled={basket.quantity === 0}
                  isLoading={checkoutLoading}
                  loadingText="Continuing to checkout..."
                  spinner={<Spinner thickness="2px" speed="0.65s" size="sm" />}
                  spinnerPlacement="start"
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

            <Collapse in={isMobile || !isMobile} animateOpacity>
              <BillingAddressForm ref={billingRef}/>
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
            bg={cardBg}
            py={8}
            borderRadius={"md"}
          >
            <Text fontWeight="semibold" textAlign={"center"}>
              You haven't made any changes to your subscription.
            </Text>
            <Text
              fontWeight="400"
              fontSize={[14, 14, 16, 18]}
              textAlign={"center"}
            >
              Add some tools or user licenses to get started.
            </Text>
          </VStack>

          <Stack
            spacing={4}
            align="center"
            direction={{ base: "column", lg: "row" }}
            w={"100%"}
          >
            <VStack
              spacing={4}
              align="center"
              w={["100%", "100%", "100%", "50%"]}
              bg={cardBg}
              borderRadius={"md"}
              p={4}
              pt={6}
              minH={["", "", "", "300px"]}
              justify={"center"}
              overflow={"hidden"}
            >
              {basket.licensedUsers === 0 ? (
                <VStack spacing={2}>
                  {/* Customer is free, show amount of free licenses they have */}
                  <HStack spacing={2} fontSize={[14, 16, 18, 18]}>
                    <LicenseAmountIndicator
                      amount={subscriptionLimits.free.maxUsers}
                    />
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
              <LicensePicker showAlreadySubscribedText={false} />
            </VStack>

            <VStack
              spacing={4}
              align="center"
              w={["100%", "100%", "100%", "50%"]}
              bg={cardBg}
              borderRadius={"md"}
              p={4}
              pt={6}
              minH={["", "", "", "300px"]}
              justify={"center"}
            >
              <ToolSelectedIndicators
                subscriptionInfo={basket.ownedSubscriptionInfo}
              />
              <Button size={"lg"} onClick={() => router.push("/tool-store")}>
                Browse Tools
              </Button>
            </VStack>
          </Stack>
        </VStack>
      )}
    </VStack>
  );
}
