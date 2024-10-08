import React from "react";
import { HStack } from "@chakra-ui/react";
import Dot from "./Dot";

interface CarouselDotsProps {
  itemsCount: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const CarouselDots: React.FC<CarouselDotsProps> = ({
  itemsCount,
  currentIndex,
  onDotClick,
}) => (
  <HStack
    spacing={[2, 4]}
    justifyContent="center"
    alignItems="center"
    position="relative"
    width="full"
    zIndex={2}
    display={["none", null, "flex"]}
  >
    {Array.from({ length: itemsCount }).map((_, index) => (
      <Dot
        key={index}
        isActive={index === currentIndex}
        onClick={() => onDotClick(index)}
      />
    ))}
  </HStack>
);

export default CarouselDots;
