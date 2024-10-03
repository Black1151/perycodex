import React from "react"
import { HStack } from "@chakra-ui/react"
import Dot from "./Dot"

interface CarouselDotsProps {
  itemsCount: number
  currentIndex: number
  onDotClick: (index: number) => void
}

const CarouselDots: React.FC<CarouselDotsProps> = ({
  itemsCount,
  currentIndex,
  onDotClick,
}) => (
  <HStack
    spacing={4}
    justifyContent="center"
    alignItems="center"
    position="absolute"
    bottom="20px"
    width="full"
    zIndex={2}
  >
    {Array.from({ length: itemsCount }).map((_, index) => (
      <Dot
        key={index}
        isActive={index === currentIndex}
        onClick={() => onDotClick(index)}
      />
    ))}
  </HStack>
)

export default CarouselDots
