"use client";

import {
  Flex,
  Spinner,
  Text,
  VStack,
  Skeleton,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useTheme } from "@chakra-ui/react";
import { PremiumToolCard } from "./ToolCard";

interface ToolSelectionPageResponse {
  resource: ToolResource[];
}

export interface ToolResource {
  id: number;
  displayName: string;
  previewText: string;
  showInSeeMoreList: boolean;
  logoImageUrl: string;
  appUrl: string;
  isTrialable: boolean;
  annualPriceId: string;
  monthlyPriceId: string;
}

const ToolStore: React.FC<ToolSelectionPageResponse> = () => {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<ToolResource[]>([]);
  const theme = useTheme();
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);

  if (!user) return null;
  const userName = user.firstName;

  const getTools = useCallback(async () => {
    try {
      const data = await fetchClient<ToolSelectionPageResponse>(
        "/api/toolConfig/allBy",
        { method: "GET" }
      );
      if (data?.resource) setTools(data.resource);
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  }, [fetchClient]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        await getTools();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Filter and split tools
  const visibleTools = tools.filter(
    (t) => t.showInSeeMoreList && !!t.logoImageUrl
  );
  const trialTools = visibleTools.filter((t) => t.isTrialable);
  const premiumTools = visibleTools.filter((t) => !t.isTrialable);

  console.log("Trial Tools", premiumTools);

  return (
    <Flex
      width="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mt={16}
      mb={12}
    >
      <HStack
        spacing={2}
        width="100vw"
        p={[2, 4, 4]}
        maxW="1400px"
        align={"left"}
        justify={"start"}
      >
        <VStack spacing={2} width="50%" align={"left"} justify={"start"}>
          <Text fontSize={40} fontWeight="bold" color={theme.colors.elementBG}>
            Tool Store
          </Text>
          <Text fontSize={14} color={theme.colors.elementBG2}>
            Here you can find all the tools you can use.
          </Text>
        </VStack>
      </HStack>
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3 }}
        spacing={4}
        width="100vw"
        maxW="1400px"
        p={[2, 4, 4]}
        mx="auto"
      >
        {loading ? (
          <>
            <Skeleton
              height="200px"
              width="100%"
              startColor={theme.colors.elementBG2}
              endColor={theme.colors.elementBG3}
            />
            <Skeleton
              height="200px"
              width="100%"
              startColor={theme.colors.elementBG2}
              endColor={theme.colors.elementBG3}
            />
            <Skeleton
              height="200px"
              width="100%"
              startColor={theme.colors.elementBG2}
              endColor={theme.colors.elementBG3}
            />
          </>
        ) : (
          premiumTools.map((tool) => (
            <PremiumToolCard key={tool.id} tool={tool} isLoading={loading} />
          ))
        )}
      </SimpleGrid>
    </Flex>
  );
};

export default ToolStore;
