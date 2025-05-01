import React from "react";
import {
  Box,
  Flex,
  Icon,
  Image,
  Text,
  useTheme,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { Construction, Lock } from "@mui/icons-material";

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
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  thumbNailImage,
  alt,
  name,
  isSelected,
  isUAGLocked,
}) => {
  const theme = useTheme();
  return (
    <VStack flex={1} mx={[0, 2]} height={60}>
      <Box
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        transition="height 0.5s ease-in-out"
        position={"relative"}
      >
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

        <Box
          filter={isUAGLocked ? "brightness(0.35)" : undefined}
          transition="filter 0.3s ease-in-out"
        >
          <Image
            src={thumbNailImage}
            fallback={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={
                  isSelected ? ["100px", null, "150px"] : ["50px", null, "75px"]
                }
                bg="gray.100"
                aspectRatio={1}
                borderRadius="full"
                transition="height 0.5s ease-in-out"
              >
                <Construction
                  sx={{
                    color: "var(--chakra-colors-primary)",
                    fontSize: "2rem",
                  }}
                />
              </Box>
            }
            alt={alt}
            height={
              isSelected ? ["100px", null, "150px"] : ["50px", null, "75px"]
            }
            objectFit="contain"
            transition="height 0.5s ease-in-out"
          />
        </Box>
      </Box>
      <Flex
        bg={isSelected ? theme.colors.primary : "white"}
        p={[1, null, 2]}
        borderRadius={5}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={[0, 3]}
        flex={1}
        width={[20, 110]}
        maxHeight={["50px", "75px"]}
        minHeight={["50px", "75px"]}
        transition="background-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out, filter 0.3s ease-in-out"
        filter={isUAGLocked ? "brightness(0.35)" : undefined}
      >
        <Text
          fontWeight="bold"
          color={isSelected ? "white" : "primary"}
          fontSize={[10, null, 14]}
          whiteSpace="pre-wrap"
          transition="color 0.5s ease-in-out"
        >
          {name.split(" ").join("\n")}
        </Text>
      </Flex>
    </VStack>
  );
};

export default CarouselItem;
