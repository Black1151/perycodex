"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Flex,
  Spinner,
  Text,
  VStack,
  Skeleton,
  HStack,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useTheme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import StoreIcon from "@mui/icons-material/Store";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import { ToolCard } from "./ToolCard";
import { ToolConfig } from "./useBasket";
import BillingCycleToggle from "./BillingCyleToggle";
import BackButton from "@/components/BackButton";
import {MoreToolsComingSoonCard} from "./MoreToolsComingSoonCard";

interface ToolSelectionPageResponse {
  resource: ToolConfig[];
}

const ToolStore: React.FC = () => {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const theme = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [allTools, setAllTools] = useState<ToolConfig[]>([]);

  const skeletonBg1 = transparentize(theme.colors.darkGray[500], 0.2)(theme);
  const skeletonBg2 = transparentize(theme.colors.darkGray[500], 0.4)(theme);

  const loadTools = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchClient<ToolSelectionPageResponse>(
        "/api/toolConfig/allBy",
        { method: "GET" }
      );
      const tools = res?.resource?.filter((t) => t.showInSeeMoreList) || [];
      setAllTools(tools);
    } catch (error) {
      console.error("Failed to load tools:", error);
      toast({
        title: "Error",
        description: "Unable to fetch tools at this time.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

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
            Tool Store
          </Text>
        </HStack>
          <BillingCycleToggle />
      </Flex>

      {/* All Tools */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 2, xl: 3 }}
        spacing={4}
        width="100%"
        py={[2, 4, 4]}
      >
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
          <Skeleton
            key={i}
            height="300px"
            startColor={skeletonBg1}
            endColor={skeletonBg2}
            borderRadius="md"
          />
        ))
          : (
          <>
            {allTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
            <MoreToolsComingSoonCard />
          </>
        )
        }
      </SimpleGrid>
    </VStack>
  );
};

export default ToolStore;
