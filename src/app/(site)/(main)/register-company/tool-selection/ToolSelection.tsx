"use client";

import {
  Flex,
  VStack,
  Text,
  Button,
  Spinner,
  Box,
  useTheme,
} from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useUser } from "@/providers/UserProvider";
import { useEffect, useState, useCallback } from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { set } from "lodash";

interface ToolSelectionPageResponse {
  resource: ToolResource[];
}

interface ToolResource {
  id: number;
  displayName: string;
  previewText: string;
  showInSeeMoreList: boolean;
  logoImageUrl: string;
  appUrl: string;
  isTrialable: boolean;
}

// Component for individual tool card
function ToolCard({
  tool,
  isPremium,
}: {
  tool: ToolResource;
  isPremium: boolean;
}) {
  const theme = useTheme();
  const cardBg = theme.colors.darkGray;
  const textColor = "white";
  const bannerBg = theme.colors.primary[500];

  return (
    <Box
      position="relative"
      w={{ base: "100%", md: "45%" }}
      border={"1px solid"}
      borderColor={"white"}
      borderRadius={"md"}
      h={"min"}
    >
      {/* Free banner for trialable tools */}
      {!isPremium && (
        <Box
          position="absolute"
          top={2}
          right={2}
          bg={bannerBg}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
          color={textColor}
          zIndex={1}
        >
          FREE
        </Box>
      )}
      <VStack
        spacing={3}
        align="start"
        p={4}
        bg={cardBg}
        color={textColor}
        borderRadius="md"
        boxShadow="sm"
      >
        <Box
          h="60px"
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={tool.logoImageUrl}
            alt={tool.displayName}
            style={{ maxHeight: "60px", objectFit: "contain" }}
          />
        </Box>

        <Text fontSize="sm" color={textColor}>
          {tool.previewText}
        </Text>

        {!isPremium && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="primary"
            onClick={() => (window.location.href = tool.appUrl)}
          >
            Launch Tool
          </Button>
        )}
      </VStack>
    </Box>
  );
}

export default function ToolSelection() {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<ToolResource[]>([]);
  const theme = useTheme();
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);

  if (!user) return null;
  const userName = user.firstName;

  const getTools = useCallback(async () => {
    setLoading(true);
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

  // Hardcoded way of calculating the end date -- this should be replaced with a more robust solution in the future
  const getEndDate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchClient<{ resource: any[] }>(
        `/api/toolCustomer/allBy?customerId=${user.customerId}`,
        { method: "GET" }
      );
      if (!response || !response.resource) {
        throw new Error("Failed to fetch resources");
      }
      const { resource } = response;
      // pick the first (or only) subscription:
      const sub = resource[0];
      if (!sub?.subStartDate) {
        throw new Error("No subscription start date found");
      }
      const startDate = new Date(sub.subStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 45);
      const formatted = `${endDate.getDate().toString().padStart(2, "0")}-${(endDate.getMonth() + 1).toString().padStart(2, "0")}-${endDate.getFullYear()}`;
      console.log("End date calculated:", formatted);
      setFormattedEndDate(formatted);
    } catch (error) {
      console.error("Error fetching end date:", error);
    } finally {
      setLoading(false);
    }
  }, [user.customerId, fetchClient]);

  useEffect(() => {
    setLoading(true);
    getTools();
    getEndDate();
    setLoading(false);
  }, []);

  // Filter and split tools
  const visibleTools = tools.filter(
    (t) => t.showInSeeMoreList && !!t.logoImageUrl
  );
  const trialTools = visibleTools.filter((t) => t.isTrialable);
  const premiumTools = visibleTools.filter((t) => !t.isTrialable);

  return (
    <PerygonContainer>
      <Flex
        direction="column"
        flex={1}
        pt={12}
        pb={16}
        alignItems="center"
        w={{ base: "100%", md: "80vw" }}
        px={{ base: 8, md: 0 }}
      >
        <VStack pt="50px" pb={8} spacing={4} align="center" w="100%">
          <Text
            as="span"
            display="inline-block"
            color={theme.colors.elementBG}
            fontFamily="bonfire"
            whiteSpace="nowrap"
            fontSize={38}
            lineHeight={1}
          >
            Congratulations, {userName}!
          </Text>
          <LetterFlyIn fontSize={64} color={theme.colors.white}>
            Perygon Is ready for you.
          </LetterFlyIn>
        </VStack>

        <Flex
          direction="column"
          align="center"
          justify="center"
          gap={8}
          w="full"
        >
          <Text color={theme.colors.white}>
            Your free Happiness Score Tool is now live. You can use it until{" "}
            {formattedEndDate} to get a better understanding of your team’s
            happiness and well-being.
          </Text>

          {loading ? (
            <Spinner size="lg" color={theme.colors.primary[500]} />
          ) : (
            <Flex direction="column" w="full" gap={10}>
              <Text fontSize="lg" fontWeight="bold" color={theme.colors.white}>
                Your Trial Tools
              </Text>
              <Flex wrap="wrap" justify="start" gap={6}>
                {trialTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} isPremium={false} />
                ))}
              </Flex>

              <Text fontSize="lg" fontWeight="bold" color={theme.colors.white}>
                Premium Tools
              </Text>
              <Flex wrap="wrap" justify="start" gap={6}>
                {premiumTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} isPremium={true} />
                ))}
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </PerygonContainer>
  );
}
