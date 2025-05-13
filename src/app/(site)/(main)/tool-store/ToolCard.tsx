import {
  Box,
  Text,
  useTheme,
  VStack,
  Skeleton,
  Spinner,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";
import { ToolResource } from "./types";
import { transparentize } from "@chakra-ui/theme-tools";
import { ToolModal } from "./ToolModal";
import { useBasketContext } from "./BasketContext";

export function PremiumToolCard({
  tool,
}: {
  tool: ToolResource;
}) {
  const theme = useTheme();
  const cardBg = transparentize(theme.colors.darkGray[500], 0.5)(theme);
  const textColor = "white";
  const premiumBannerBg =
    theme.colors.secondary?.[500] || theme.colors.purple[500];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const basket = useBasketContext();
  

  return (
    <VStack>
      <Box
        position="relative"
        w="100%"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.40)"
        borderRadius="md"
        overflow="hidden"
        h="100%"
        display="flex"
        flexDirection="column"
      >
        {/* Rotated banner in corner */}
        <Box
          position="absolute"
          top="65px"
          right="-20px"
          width={"120px"}
          bg={premiumBannerBg}
          px={4}
          py={1}
          transform="rotate(45deg)"
          transformOrigin="100% 0"
          fontSize="sm"
          fontWeight="bold"
          color={textColor}
          zIndex={1}
          alignContent={"center"}
          textAlign={"center"}
        >
          PREMIUM
        </Box>

        <Box
          position="absolute"
          px={3}
          py={3}
          fontSize="sm"
          fontWeight="bold"
          color={textColor}
          zIndex={1}
          alignContent={"center"}
          textAlign={"center"}
        >
          <Lock fontSize="small" sx={{ color: textColor }} />
        </Box>

        <VStack
          spacing={4}
          align="start"
          p={4}
          bg={cardBg}
          color={textColor}
          borderRadius="md"
          boxShadow="sm"
          flex="1"
        >
          <Box
            h="80px"
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <img
              src={tool.logoImageUrl}
              alt={tool.displayName}
              style={{
                maxHeight: "80px",
                objectFit: "contain",
                width: "auto",
              }}
            />
          </Box>

          <Text fontSize="sm">{tool.previewText}</Text>
          <Button
            size="sm"
            variant="outline"
            color="white"
            _hover={{ color: "black", backgroundColor: "white" }}
            onClick={onOpen}
          >
            View Details
          </Button>
        </VStack>

        <ToolModal
          isOpen={isOpen}
          onClose={onClose}
          tool={tool}
        />
      </Box >
    </VStack >
  );
}
