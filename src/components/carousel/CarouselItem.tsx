import React from "react";
import { Box, Flex, Icon, Image, VStack, Tooltip } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";

export interface CarouselItemProps {
  thumbNailImage: string;
  iconImage: string;
  backgroundImage: string;
  alt: string;
  name: string;
  description: string;
  isSelected?: boolean;
  appUrl: string;
  toolId: string;
  toolWfId: string;
  isUAGLocked: boolean;
  logoImage: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  thumbNailImage,
  alt,
  isSelected,
  isUAGLocked,
}) => {
  return (
    <VStack flex={1} height={[50, 120, 130, 150, 195]}>
      <Box
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        transition="height 0.5s ease-in-out"
        position="relative"
      >
        {/* Lock Icon */}
        {isUAGLocked && (
          <Tooltip label={"You do not have access to this tool"} hasArrow>
            <Flex
              position="absolute"
              top={[1, 2]}
              right={[1, 2]}
              zIndex={2}
              bg="white"
              border={"2px solid var(--chakra-colors-primary)"}
              borderRadius="full"
              justify="center"
              align="center"
              aspectRatio={1}
              p={[0.5, 1]}
              transition="all 0.5s ease-in-out"
              boxShadow="sm"
            >
              <Icon
                as={Lock}
                boxSize={
                  isSelected
                    ? ["0.75rem", "1rem", "1.25rem"]
                    : ["0.5rem", "0.75rem", "1rem"]
                }
                transition="all 0.5s ease-in-out"
                color="gray.700"
              />
            </Flex>
          </Tooltip>
        )}

        {/* Thumbnail Image */}
        <Box
          filter={isUAGLocked ? "brightness(0.35)" : undefined}
          transition="filter 0.3s ease-in-out"
        >
          <Image
            src={thumbNailImage}
            alt={alt}
            height={
              isSelected
                ? ["120px", "150px", "180px", "200px", "250px"]
                : ["90px", "112px", "120px", "160px", "180px"]
            }
            transition="height 0.3s ease-in-out"
          />
        </Box>

        {/* “Let’s go!” Button */}
        {/* <Box
          position="absolute"
          top={[null, null, -39, null, -25]}
          right={[null, null, -140, null, -125]}
          transform={
            isSelected
              ? "translate(-50%, -10%) scale(1) rotate(20deg)"
              : "translate(-50%, -100%) scale(0.5) rotate(90deg)"
          }
          opacity={isSelected ? 1 : 0}
          transition="all 0.5s ease-in-out"
          zIndex={3}
          display={["none", "none", "block"]}
        >
          <Button
            colorScheme="teal"
            boxShadow="md"
            padding={[2, 4, 8]}
            color="white"
            bgColor={theme.colors.primary}
            _hover={{
              bgColor: "white",
              color: theme.colors.primary,
            }}
          >
            <Text fontFamily="Metropolis" fontSize={[10, 14, 30]}>
              Start!
            </Text>
          </Button>
        </Box> */}
      </Box>
    </VStack>
  );
};

export default CarouselItem;
