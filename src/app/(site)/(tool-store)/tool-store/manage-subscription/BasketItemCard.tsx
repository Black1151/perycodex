import React from "react";
import {
  Flex,
  HStack,
  Box,
  Image,
  Text,
  Badge,
  VStack,
  IconButton,
  Spinner,
  useTheme,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { FiTrash2 } from "react-icons/fi";
import AnimatedTillNumber from "@/components/animations/AnimatedTillNumber";
import { BasketItem } from "../useBasket";
import { Delete, DeleteOutline } from "@mui/icons-material";

interface BasketItemCardProps {
  item: BasketItem;
  licensedUsers: number;
  isNew: boolean;
  removingIds: Set<string>;
  handleRemove: (uniqueId: string) => Promise<void> | void;
}

const BasketItemCard: React.FC<BasketItemCardProps> = ({
  item,
  licensedUsers,
  isNew,
  removingIds,
  handleRemove,
}) => {
  const theme = useTheme();
  const cardBg = transparentize(theme.colors.elementBG, 0.95)(theme);
  const removing = removingIds.has(item.uniqueId);

  return (
    <Flex
      direction={"column"}
      borderRadius="md"
      boxShadow="sm"
      p={4}
      align="center"
      justify="space-between"
      bg={cardBg}
      position="relative"
      overflow={"hidden"}
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        w="100%"
        align="top"
        justify="space-between"
      >
        {isNew && !item.isFree && (
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
            zIndex={10}
            opacity={0.75}
          >
            NEW!
          </Box>
        )}

        {item.isFree && (
          <Box
            position="absolute"
            top={0}
            left={0}
            bg={"blue.600"}
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
            zIndex={10}
            opacity={0.75}
          >
            FREE
          </Box>
        )}

        <HStack>
          {item.toolConfig?.iconImageUrl && (
            <Image
              src={item.toolConfig.iconImageUrl}
              boxSize="80px"
              objectFit="contain"
            />
          )}

          <VStack
            spacing={0}
            align="baseline"
            w={"100%"}
            justify={"center"}
            h={"100%"}
          >
            <HStack spacing={1} mb={2} flexWrap="wrap">
              <Text
                fontWeight="semibold"
                noOfLines={2}
                fontSize={[16, 18, 20, 20]}
                cursor="pointer"
                onClick={() =>
                  window.open(
                    `/tool-store/${item.toolConfigUniqueId}`,
                    "_blank"
                  )
                }
              >
                {item.toolConfig.displayName}
              </Text>
            </HStack>

            <HStack spacing={1} fontSize="md" align="center">
              <AnimatedTillNumber
                value={licensedUsers}
                fontSize="md"
                duration={0.65}
                isCurrency={false}
              />
              <Text fontWeight="normal" noOfLines={2}>
                Licenses
              </Text>
              <Badge colorScheme="blue">+{item.quantity} New Licenses</Badge>
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
          {item.itemGrandTotal != item.itemSubtotal && (
            <HStack spacing={1} fontSize="24">
              <Text
                fontSize="sm"
                color="gray.500"
                textDecoration="line-through"
              >
                £
              </Text>
              <AnimatedTillNumber
                value={item.itemSubtotal}
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
              value={item.itemGrandTotal}
              fontSize="lg"
              duration={0.65}
            />
          </HStack>
        </Stack>
      </Flex>

      {/* Discounts */}
      <Flex
        direction={{ base: "column", sm: "row" }}
        align="flex-end"
        gap={2}
        justify={"flex-end"}
        mt={2}
        w="100%"
      >
        {item.discounts.map((discount) => (
          <Badge key={discount.uniqueId} colorScheme="green" fontSize="0.8em">
            {discount.name}
          </Badge>
        ))}
      </Flex>

      {/* //TODO: Only allow remove when tool is new */}
      {/* <IconButton
        aria-label="Remove"
        icon={
          removing ? (
            <Spinner size="sm" color="red.500" />
          ) : (
            <DeleteOutline fontSize="small" />
          )
        }
        colorScheme="red"
        variant="ghost"
        position="absolute"
        top={2}
        right={2}
        onClick={() => handleRemove(item.uniqueId)}
        isLoading={removing}
        _hover={{
          bg: "red.100",
        }}
        _active={{
          bg: "red.200",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        _disabled={{
          cursor: "not-allowed",
          opacity: 0.5,
        }}
        isDisabled={removing}
        size="sm"
        borderRadius="full"
        bg={removing ? "red.50" : "white"}
      /> */}
    </Flex>
  );
};

export default BasketItemCard;
