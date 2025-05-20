import React from "react";
import {
  Flex,
  HStack,
  Box,
  Image,
  Text,
  Badge,
  VStack,
  useTheme,
  Stack,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { SubscriptionInfo } from "../useBasket"; // adjust the import path as needed

interface ToolInfoCardProps {
  info: SubscriptionInfo;
  licensedUsers: number;
  isNew: boolean;
}

const ToolInfoCard: React.FC<ToolInfoCardProps> = ({
  info,
  licensedUsers,
  isNew,
}) => {
  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);

  return (
    <Flex
      direction="column"
      borderRadius="md"
      boxShadow="sm"
      p={4}
      align="center"
      justify="space-between"
      bg={cardBg}
      position="relative"
      overflow="hidden"
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        w="100%"
        align="top"
        justify="space-between"
      >
        {isNew && (
          <Box
            position="absolute"
            top={0}
            left={0}
            bg={theme.colors.seduloGreen}
            color="white"
            px={8}
            mx={-5}
            my={12}
            py={1}
            fontSize="sm"
            fontWeight="bold"
            textAlign="center"
            transform="rotate(-45deg)"
            transformOrigin="top left"
            zIndex={1}
            opacity={0.75}
          >
            NEW!
          </Box>
        )}

        <HStack w="100%">
          {info.iconImageUrl && (
            <Image
              src={info.iconImageUrl}
              boxSize="80px"
              objectFit="contain"
            />
          )}

          <VStack
            spacing={0}
            align="baseline"
            w="100%"
            justify="center"
            h="100%"
          >
            <HStack spacing={1} mb={2} flexWrap="wrap" w="100%">
              <Text
                fontWeight="semibold"
                w="100%"
                noOfLines={2}
                fontSize={[16, 18, 20, 20]}
                cursor="pointer"
                onClick={() =>
                  window.open(`/tool-store/${info.uniqueId}`, "_blank")
                }
              >
                {info.displayName}
              </Text>
            </HStack>

            <HStack spacing={1} fontSize="md" align="center" w="100%">
              <AnimatedTillNumber
                value={licensedUsers}
                fontSize="md"
                duration={0.65}
                isCurrency={false}
              />
              <Text fontWeight="normal" noOfLines={2}>
                Licenses
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <Stack
          direction={{ base: "row", sm: "column" }}
          align={{ base: "center", sm: "flex-end" }}
          spacing={2}
          mt={{ base: 4, md: 0 }}
          w="100%"
          justify={{ base: "center", sm: "center" }}
        >
          {info.itemGrandTotal !== info.itemSubtotal && (
            <HStack spacing={1} fontSize="24">
              <Text
                fontSize="sm"
                color="gray.500"
                textDecoration="line-through"
              >
                £
              </Text>
              <AnimatedTillNumber
                value={info.itemSubtotal}
                fontSize="sm"
                duration={0.65}
                color="gray.500"
                textDecoration="line-through"
              />
            </HStack>
          )}

          <HStack spacing={1} fontSize="lg">
            <Text fontWeight="bold">£</Text>
            <AnimatedTillNumber
              value={info.itemGrandTotal}
              fontSize="lg"
              duration={0.65}
            />
          </HStack>
        </Stack>
      </Flex>

      {/* Discounts */}
      <Flex
        direction={{ base: "column", sm: "row" }}
        align="center"
        gap={2}
        justify="flex-end"
        mt={2}
        w="100%"
      >
        {info.discounts.map((discount) => (
          <Badge key={discount.uniqueId} colorScheme="green" fontSize="0.8em">
            {discount.name}
          </Badge>
        ))}
      </Flex>
    </Flex>
  );
};

export default ToolInfoCard;
