import React from "react"
import { Box, Image, Text, VStack } from "@chakra-ui/react"

export interface CarouselItemProps {
  logoImage: string
  backgroundImage: string
  alt: string
  name: string
  description: string
  isSelected?: boolean
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  logoImage,
  alt,
  name,
  isSelected,
}) => {
  return (
    <VStack>
      <Box
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        transition="height 0.5s ease-in-out"
      >
        <Image
          src={logoImage}
          alt={alt}
          height={
            isSelected ? ["75px", null, "125px"] : ["50px", null, "100px"]
          }
          objectFit="contain"
          transition="height 0.5s ease-in-out"
        />
      </Box>
      <Box bg="black" opacity={0.8} p={[1, null, 2]} borderRadius={5}>
        <Text fontWeight="bold" color="white" fontSize={[9, null, 12]}>
          {name}
        </Text>
      </Box>
    </VStack>
  )
}

export default CarouselItem
