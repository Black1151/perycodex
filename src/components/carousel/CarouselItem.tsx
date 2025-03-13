import React from "react";
import { Box, Flex, Image, Text, useTheme, VStack } from "@chakra-ui/react";
import { Construction } from "@mui/icons-material";

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
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  thumbNailImage,
  alt,
  name,
  isSelected,
}) => {
  const theme = useTheme();
  return (
    <VStack flex={1} mx={[0, 2]} height={60}>
      <Box
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        transition="height 0.5s ease-in-out"
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
                  color: "var(--chakra-colors-perygonPink)",
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
        transition="background-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out"
      >
        <Text
          fontWeight="bold"
          color={isSelected ? "white" : "perygonPink"}
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
