"use client";

import React, { useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Link,
  Code,
  Box,
  Stack,
  useToast,
  useTheme,
} from "@chakra-ui/react";
import { useBasket } from "../useBasket";
import { useUser } from "@/providers/UserProvider";
import { Header } from "../Header";
import { Phone } from "@mui/icons-material";

const SUPPORT_EMAIL = "sales@perygon.co.uk";
const SUPPORT_TEL = "0333 222 4445";

const ContactSales: React.FC = () => {
  const { subscription, getSubscription } = useBasket();
  const user = useUser();
  const toast = useToast();
  const theme = useTheme();

  useEffect(() => {
    if (!subscription?.uniqueId) {
      getSubscription();
    }
  }, [subscription, getSubscription]);

  return (
    <VStack spacing={3} align="center" justify="center" w="100%">
      <Header title="Contact Sales" />

      <Box
        bg={theme.colors.elementBG}
        borderRadius="lg"
        boxShadow="sm"
        p={6}
        color={theme.colors.primaryTextColor}
      >
        <Text mb={4}>
          To discuss an order, change your billing cycle, adjust an annual
          subscription, or any other sales inquiries, please contact us using
          the information below.
        </Text>
      </Box>

      <Stack flexDirection={["column", "column", "row"]} w={"100%"}>
        <Box
          bg={theme.colors.elementBG}
          borderRadius="lg"
          boxShadow="sm"
          w="100%"
          p={6}
          color={theme.colors.primaryTextColor}
        >
          <VStack align="start" spacing={3}>
            <Text>
              <strong>Phone:</strong>{" "}
              <Link href={`tel:${SUPPORT_TEL}`} color="teal.500">
                {SUPPORT_TEL}
              </Link>
            </Text>
            <Text>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${SUPPORT_EMAIL}`} color="teal.500">
                {SUPPORT_EMAIL}
              </Link>
            </Text>
          </VStack>
        </Box>

        <Box
          bg={theme.colors.elementBG}
          borderRadius="lg"
          boxShadow="sm"
          p={6}
          w={"100%"}
          color={theme.colors.primaryTextColor}
        >
          <VStack align="start" spacing={3}>
            <HStack>
              <Text fontWeight="bold">Your Subscription ID:</Text>
              <Code fontSize="lg">
                {subscription?.uniqueId
                  ? subscription.uniqueId.slice(0, 6)
                  : "N/A"}
              </Code>
            </HStack>

            <HStack>
              <Text fontWeight="bold">Your Organisation ID:</Text>
              <Code fontSize="lg">
                {user.user?.customerUniqueId?.slice(0, 6) || "Unknown"}
              </Code>
            </HStack>
          </VStack>
        </Box>
      </Stack>
    </VStack>
  );
};

export default function Page() {
  return <ContactSales />;
}
