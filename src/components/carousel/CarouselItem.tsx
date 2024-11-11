import React from "react";
import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";

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
  toolWfId: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  thumbNailImage,
  alt,
  name,
  isSelected,
}) => {
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
          alt={alt}
          height={
            isSelected ? ["100px", null, "150px"] : ["50px", null, "75px"]
          }
          objectFit="contain"
          transition="height 0.5s ease-in-out"
        />
      </Box>
      <Flex
        bg={isSelected ? "perygonPink" : "white"}
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
