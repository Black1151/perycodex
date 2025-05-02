"use client";

import {
  Flex,
  Spinner,
  Text,
  VStack,
  Skeleton,
  HStack,
  SimpleGrid,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useTheme } from "@chakra-ui/react";
import { PremiumToolCard } from "./ToolCard";
import { transparentize } from "@chakra-ui/theme-tools";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import LockIcon from "@mui/icons-material/Lock";
import { LicensesModal } from "./LicesesModal";
import { useBasketContext } from "./BasketContext";
import {
  ToolResource,
  ToolCustomerResource,
  ToolSelectionPageResponse,
} from "./types";
import CheckoutModal from "./CheckoutModal";

const ToolStore: React.FC<ToolSelectionPageResponse> = () => {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [licensesLoading, setLicensesLoading] = useState(false);
  const toast = useToast();
  const {
    selected,
    setSelected,
    addToolToSelection,
    removeToolFromSelection,
    isInBasket,
    summary,
    allTools,
    setAllTools,
    ownedTools,
    setOwnedTools,
    unownedTools,
    setUnownedTools,
    currentLicenses,
    setCurrentLicenses,
    setAdditionalLicenses,
    additionalLicenses,
  } = useBasketContext();

  if (!user) return null;

  useEffect(() => {
    const fetchToolData = async () => {
      setLoading(true);
      try {
        // 1) grab all tools first
        const allRes = await fetchClient<ToolSelectionPageResponse>(
          "/api/toolConfig/allBy",
          { method: "GET" }
        );
        const allTools = allRes?.resource ?? [];
        const toolsToShow = allTools.filter((tool) => tool.showInSeeMoreList);
        setAllTools(toolsToShow);

        // 2) then, if we have a customerId, grab their current subscriptions…
        if (user.customerId) {
          const custRes = await fetchClient<{
            resource: ToolCustomerResource[];
          }>(`/api/toolCustomer/allBy?customerId=${user.customerId}`, {
            method: "GET",
          });
          const customerTools = custRes?.resource ?? [];

          console.log("User tools response:", customerTools);

          // 3) match by id and setUsersTools
          const userIds = customerTools.map((tc) => tc.toolConfigId);
          const owned = toolsToShow.filter((t) => userIds.includes(t.id));
          const unowned = toolsToShow.filter((t) => !userIds.includes(t.id));
          setOwnedTools(owned);
          setUnownedTools(unowned);
        }
      } catch (err) {
        console.error("Error fetching tools or user tools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToolData();
  }, [user.customerId]);

  //get teh amount of liscened users the customer has
  const getCurrentLicenses = useCallback(() => {
    setLicensesLoading(true);
    if (user.customerId) {
      fetchClient<{ resource: any }>(
        `/api/customer/findBy?id=${user.customerId}`,
        { method: "GET" }
      ).then((res) => {
        if (!res?.resource) {
          console.error("Error fetching licenses");
          setLicensesLoading(false);
          return;
        }
        const licenses = res?.resource?.licensedUsers;
        setCurrentLicenses(licenses);
      });
    }
    setLicensesLoading(false);
  }, [user.customerId]);

  useEffect(() => {
    getCurrentLicenses();
  }, [user.customerId]);

  const cardBg = transparentize(theme.colors.darkGray[500], 0.65)(theme);
  const skeletonBg1 = transparentize(theme.colors.darkGray[500], 0.2)(theme);
  const skeletonBg2 = transparentize(theme.colors.darkGray[500], 0.4)(theme);
  return (
    <VStack spacing={0} align="center" justify="center" w="100%" maxW="1400px">
      {/* Header */}
      <HStack
        spacing={2}
        w="100%"
        p={[2, 4, 4]}
        maxW="1400px"
        align="left"
        justify="space-between"
        bg={cardBg}
        borderRadius="md"
        borderWidth="1px"
        borderColor="rgba(255, 255, 255, 0.80)"
        flexWrap="wrap"
      >
        <Flex
          gap={0}
          width={["100%", "100%", "150%"]}
          align="left"
          justify={["center", "start"]}
          flexDirection="column"
        >
          <HStack spacing={4} fontSize={[32, 48]} w="full">
            <StoreIcon
              fontSize="inherit"
              sx={{ color: theme.colors.elementBG, marginBottom: "10px" }}
            />
            <Text
              fontWeight="400"
              color={theme.colors.elementBG}
              fontFamily="bonfire"
            >
              Perygon Tool Store
            </Text>
          </HStack>
          <Text fontSize={{ base: 14, md: 16 }} color={theme.colors.elementBG}>
            Here you can find all the tools you can use.
          </Text>
        </Flex>
        <Flex
          gap={2}
          flexDirection={["row", "column"]}
          minW={{ base: "100%", md: "15%" }}
          align={["start", "end"]}
          justify={["start", "end"]}
          mt={{ base: 4, md: 0 }}
          w="full"
        >
          <HStack>
            <BadgeIcon sx={{ color: theme.colors.elementBG }} />
            <Text
              fontSize={{ base: 14, md: 16 }}
              color={theme.colors.elementBG}
            >
              Licenses: <b>{currentLicenses}</b>
            </Text>
          </HStack>
          <HStack>
            <PersonIcon sx={{ color: theme.colors.elementBG }} />
            <Text
              fontSize={{ base: 14, md: 16 }}
              color={theme.colors.elementBG}
            >
              Active Users: <b></b>
            </Text>
          </HStack>
        </Flex>
        <Button
          w="full"
          color="white"
          fontSize={{ base: 14, md: 16 }}
          onClick={onOpen}
        >
          Manage Licenses
        </Button>
      </HStack>

      {/* Tabs */}
      <Tabs variant="line" width="100vw" maxW="1400px" mt={6} w={"100%"}>
        <TabList
          mb={4}
          color={theme.colors.elementBG}
          bg={cardBg}
          borderRadius="md"
          px={2}
          fontSize={{ base: 14, md: 16 }}
        >
          <Tab color={"white"}>All Tools</Tab>
          <Tab color={"white"}>My Tools</Tab>
          <Tab color={"white"} gap={1}>
            <LockIcon fontSize={"inherit"} />
            Locked Tools
          </Tab>
        </TabList>

        <TabPanels>
          {/* All Tools */}
          <TabPanel p={0}>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={4}
              width="100%"
              py={[2, 4, 4]}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      height="200px"
                      startColor={skeletonBg1}
                      endColor={skeletonBg2}
                      borderRadius="md"
                    />
                  ))
                : allTools.map((tool) => (
                    <PremiumToolCard
                      key={tool.id}
                      tool={tool}
                    />
                  ))}
            </SimpleGrid>
          </TabPanel>

          {/* My Tools */}
          <TabPanel p={0}>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={4}
              width="100%"
              py={[2, 4, 4]}
            >
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    height="200px"
                    startColor={skeletonBg1}
                    endColor={skeletonBg2}
                    borderRadius="md"
                  />
                ))
              ) : ownedTools.length > 0 ? (
                ownedTools.map((tool) => (
                  <PremiumToolCard
                    key={tool.id}
                    tool={tool}
                  />
                ))
              ) : (
                <Text>You have no active tools</Text>
              )}
            </SimpleGrid>
          </TabPanel>

          {/* Locked Tools */}
          <TabPanel p={0}>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={4}
              width="100%"
              py={[2, 4, 4]}
            >
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    height="200px"
                    startColor={skeletonBg1}
                    endColor={skeletonBg2}
                    borderRadius="md"
                  />
                ))
              ) : unownedTools.length > 0 ? (
                unownedTools.map((tool) => (
                  <PremiumToolCard
                    key={tool.id}
                    tool={tool}
                  />
                ))
              ) : (
                <Text>No locked tools</Text>
              )}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <LicensesModal
        isOpen={isOpen}
        onClose={(changeAmount) => {
          if (changeAmount) {
            setAdditionalLicenses(changeAmount);
          } else {
            toast({
              title: "Error",
              description: "Failed to update licenses in basket.",
              status: "error",
            });
          }
          onClose();
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <VStack spacing={4}>
        <Text fontSize="lg">Basket ({summary.count} tools)</Text>
        {additionalLicenses > 0 ? (
          <HStack justify="space-between" w="100%">
            <Text fontSize="sm">Change in licenses: {additionalLicenses}</Text>
            <Button size="xs" onClick={() => setSelected([])}>
              Remove
            </Button>
          </HStack>
        ) : (
          <>no change in licenses</>
        )}

        {selected.length === 0 ? (
          <Text>Your basket is empty</Text>
        ) : (
          <>
            {selected.map((p) => (
              <HStack key={p.id} justify="space-between" w="100%">
                <Text>{p.displayName}</Text>
                <Button size="xs" onClick={() => removeToolFromSelection(p)}>
                  Remove
                </Button>
              </HStack>
            ))}
          </>
        )}

        <Button mt={4} onClick={() => setIsCheckoutOpen(true)}>
          Checkout
        </Button>
      </VStack>
    </VStack>
  );
};

export default ToolStore;
