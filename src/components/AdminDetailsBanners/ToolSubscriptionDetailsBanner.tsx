"use client";

import React from "react";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import { ShoppingCartCheckout } from "@mui/icons-material";

interface ToolSubscription {
  id: number;
  toolConfigId: number;
  customerId: number;
  subStartDate: string;
  subscriptionTypeId: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface ToolSubscriptionDetailsBannerProps {
  toolSubscription: ToolSubscription;
}

export const ToolSubscriptionDetailsBanner: React.FC<
  ToolSubscriptionDetailsBannerProps
> = ({ toolSubscription }) => {
  return (
    <Flex mb={4} p={4} color={"white"} overflow={"hidden"}>
      {/* Tool Icon */}
      <FormControl
        w={"100px"}
        h={"100px"}
        aspectRatio={1}
        borderRadius={"full"}
      >
        <Box
          position="relative"
          w={"100px"}
          h={"100px"}
          borderRadius="full"
          bg="gray.100"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ShoppingCartCheckout
            fontSize="large"
            sx={{ color: "var(--chakra-colors-perygonPink)" }}
          />
        </Box>
      </FormControl>

      {/* Tool Information */}
      <VStack align="start" ml={4} minW={"300px"} spacing={3}>
        <Flex alignItems="center">
          <Heading size={["md", "md", "lg"]} fontWeight={300}>
            {toolSubscription.toolConfigId}
          </Heading>
          <Box
            ml={2}
            w={4}
            h={4}
            borderRadius="full"
            border={"white 1px solid"}
            bg={toolSubscription.isActive ? "green.500" : "red.500"}
          />
        </Flex>
      </VStack>

      {/* Metadata Information */}
      <VStack
        ml="auto"
        alignItems="end"
        justifyContent="flex-start"
        display={["none", "none", "flex"]}
      >
        <Heading size={["md", "md", "lg"]} fontWeight={100}>
          ID: {toolSubscription.id}
        </Heading>
        <Flex direction="row" justify="center" align="center" gap={2}>
          <CreateIcon />
          <Text fontSize="sm">
            {moment(toolSubscription.createdAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
        <Flex direction="row" justify="center" align="center" gap={2}>
          <UpdateIcon />
          <Text fontSize="sm">
            {moment(toolSubscription.updatedAt).format("D/MM/YYYY")}
          </Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
