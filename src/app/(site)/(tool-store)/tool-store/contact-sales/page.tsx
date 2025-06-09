"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Stack,
  HStack,
  Code,
} from "@chakra-ui/react";
import { useBasket } from "../useBasket";
import { useUser } from "@/providers/UserProvider";
import { Phone } from "@mui/icons-material";
import BackButton from "@/components/BackButton";

const SUPPORT_EMAIL = "sales@perygon.co.uk";
const SUPPORT_TEL = "0333 222 4445";

const ContactSales: React.FC = () => {
  const {subscription, getSubscription} = useBasket();
  const user = useUser();

  if (!subscription?.uniqueId) {
    getSubscription()
  }

  return (
    <Box
      maxW="500px"
      mx="auto"
      my="8"
      p="8"
      bg={"white"}
      borderRadius="lg"
      boxShadow="md"
    >
      <HStack align={"center"} mb={4} spacing={4}>
        <BackButton color={"grey.700"} iconSize="medium" />
        <Heading
          as="h1"
          size="xl"
          fontWeight={"normal"}
          fontFamily={"bonfire"}
          mb={-3}
        >
          Contact Sales
        </Heading>
        <Phone fontSize="large" />
      </HStack>
      <Text mb="4">
        To discuss an order, change your billing cycle, adjust an annual subscription or any other
        sales inquiries, please contact us using the information below.
      </Text>
      <Stack spacing={2} mb={6}>
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
      </Stack>
      <>
        <HStack>
          <Text fontWeight="bold">Your Subscription ID:</Text>
          <Code mt={1} fontSize="md">
            {subscription?.uniqueId
              ? subscription.uniqueId.slice(0, 6)
              : "Loading..."}
          </Code>
        </HStack>

        <HStack>
          <Text fontWeight="bold">Your Organisation ID:</Text>
          <Code mt={1} fontSize="md">
            {user.user?.customerUniqueId?.slice(0, 6)}
          </Code>
        </HStack>
      </>
    </Box>
  );
};

export default function Page() {
  return <ContactSales/>;
}
