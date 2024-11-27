"use client";

import React from "react";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import SellIcon from "@mui/icons-material/Sell";
import { Tag } from "../tags/Tag";
import BackButton from "@/components/BackButton";

export interface Tag {
  id: number;
  name: string;
  assocId?: number;
  colour: string;
  icon?: string;
  score?: number;
  weight?: string;
  customerId?: number;
  isPublic?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface TagDetailsBannerProps {
  tag: Tag;
}

export const TagDetailsBanner: React.FC<TagDetailsBannerProps> = ({ tag }) => {
  return (
    <Flex mb={4} p={4} color={"white"} overflow={"hidden"} gap={2}>
      <BackButton />
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
          <Image
            src={tag.icon}
            alt={tag.name}
            w={"100px"}
            h={"100px"}
            borderRadius="full"
            objectFit="cover"
            fallback={
              <>
                <SellIcon
                  fontSize="large"
                  sx={{ color: "var(--chakra-colors-perygonPink)" }}
                />
              </>
            }
          />
        </Box>
      </FormControl>

      {/* Tag Information */}
      <VStack align="start" ml={4} minW={"300px"} spacing={3}>
        <Flex alignItems="center" gap={2}>
          <Box
            w={"1.4rem"}
            h={"1.4rem"}
            borderRadius="full"
            border={"white 1px solid"}
            bg={tag.isActive ? "green.500" : "red.500"}
          />
          <Heading fontWeight={300} size={["md", "md", "lg"]}>
            {tag.name}
          </Heading>
        </Flex>

        <Tag id={tag.id} name={tag.name} colour={tag.colour} />
      </VStack>

      {/* Metadata Information */}
      <VStack
        ml={"auto"}
        alignItems={"end"}
        justifyContent={"flex-start"}
        display={["none", "none", "flex"]}
      >
        <Heading size={["md", "md", "lg"]} fontWeight={100}>
          ID: {tag.id}
        </Heading>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <CreateIcon />
          <Text fontSize="sm">{moment(tag.createdAt).format("D/MM/YYYY")}</Text>
        </Flex>
        <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
          <UpdateIcon />
          <Text fontSize="sm">{moment(tag.updatedAt).format("D/MM/YYYY")}</Text>
        </Flex>
      </VStack>
    </Flex>
  );
};
