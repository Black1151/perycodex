"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { LocationOn } from "@mui/icons-material";
import moment from "moment/moment";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import DomainIcon from "@mui/icons-material/Domain";
import { useRouter } from "next/navigation";
import { TagsDisplay } from "@/components/tags/TagsDisplay";
import { useFetchClient } from "@/hooks/useFetchClient";
import { TagsResponse } from "@/app/api/tags/getTags/route";
import { Tag } from "./TagDetailsBanner";

interface Site {
  id: number;
  siteName: string;
  siteEmail?: string;
  siteTel?: string;
  address1: string;
  address2: string;
  address3?: string;
  postcode: string;
  country?: string;
  uniqueId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

type Customer = {
  name: string;
  uniqueId: string;
};

interface SiteDetailsBannerProps {
  site: Site;
}

export const SiteDetailsBanner: React.FC<SiteDetailsBannerProps> = ({
  site,
}) => {
  const router = useRouter();
  const { fetchClient } = useFetchClient();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetchClient(
        `/api/tags/getTags?recordTypeId=3&recordId=${site.id}`
      );

      if (response) {
        const tagsResponse = response as TagsResponse;
        setTags(tagsResponse.resource);
      }
    };

    fetchTags();
  }, []);

  return (
    <VStack w={"100%"} flex={1} align={"stretch"}>
      <Flex mb={4} p={[0, 0, 4]} color={"white"} overflow={"hidden"}>
        {/* Site Icon and Name */}
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
            <LocationOn
              fontSize="large"
              sx={{ color: "var(--chakra-colors-perygonPink)" }}
            />
          </Box>
        </FormControl>

        {/* Site Information */}
        <VStack align="start" ml={4}>
          <Flex alignItems="center" gap={2}>
            <Box
              w={"1.4rem"}
              h={"1.4rem"}
              borderRadius="full"
              border={"white 1px solid"}
              bg={site.isActive ? "green.500" : "red.500"}
            />
            <Heading fontWeight={300} size={["md", "md", "lg"]}>
              {site.siteName}
            </Heading>
          </Flex>
          <Flex direction={"row"} align={"flex-start"} gap={2}>
            <LocationOnOutlinedIcon />
            <Text fontSize="sm">
              {site.address1}, {site.address2}, {site.address3}, {site.postcode}
              , {site.country}
            </Text>
          </Flex>

          <Flex
            direction={"row"}
            justify={"center"}
            align={"flex-start"}
            gap={2}
          >
            <DomainIcon />
            <Text
              fontSize="sm"
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() =>
                router.push(`/customers/${site.customer?.uniqueId}`)
              }
            >
              {site.customer && site?.customer?.name}
            </Text>
          </Flex>

          <Flex direction={"row"} align={"center"} gap={2}>
            <PhoneOutlinedIcon />
            <Text fontSize="sm">{site.siteTel}</Text>
          </Flex>
        </VStack>

        {/* Site ID on the right */}
        <VStack
          ml={"auto"}
          alignItems={"end"}
          justifyContent={"flex-start"}
          display={["none", "none", "flex"]}
        >
          <Heading size={["md", "md", "lg"]} fontWeight={100}>
            ID: {site.id}
          </Heading>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <CreateIcon />
            <Text fontSize="sm">
              {moment(site.createdAt).format("D/MM/YYYY")}
            </Text>
          </Flex>
          <Flex direction={"row"} justify={"center"} align={"center"} gap={2}>
            <UpdateIcon />
            <Text fontSize="sm">
              {moment(site.updatedAt).format("D/MM/YYYY")}
            </Text>
          </Flex>
        </VStack>
      </Flex>
      <Flex px={4}>
        <TagsDisplay tags={tags} />
      </Flex>
    </VStack>
  );
};
