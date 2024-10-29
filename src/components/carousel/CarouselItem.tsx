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
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  thumbNailImage,
  alt,
  name,
  isSelected,
}) => {
  return (
    <VStack flex={1} mx={[0, 2]}>
      <Box
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        transition="height 0.5s ease-in-out"
      >
        <Image
          src={thumbNailImage}
          alt={alt}
          height={isSelected ? ["75px", null, "125px"] : ["50px", null, "75px"]}
          objectFit="contain"
          transition="height 0.5s ease-in-out"
        />
      </Box>
      <Flex
        bg="white"
        p={[1, null, 2]}
        borderRadius={5}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minHeight={10}
        px={[0, 3]}
        flex={1}
        width="100%"
      >
        <Text fontWeight="bold" color="perygonPink" fontSize={[12, null, 16]}>
          {name}
        </Text>
      </Flex>
    </VStack>
  );
};

export default CarouselItem;
