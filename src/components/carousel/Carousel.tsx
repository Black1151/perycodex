import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import CarouselControls from "./CarouselControls";
import CarouselDots from "./CarouselDots";
import CarouselItem, { CarouselItemProps } from "./CarouselItem";
import useCarousel from "@/hooks/useCarousel";

interface CarouselProps {
  carouselItems: CarouselItemProps[];
  setParentIndex?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  carouselItems,
  setParentIndex,
}) => {
  const { currentIndex, prevSlide, nextSlide, updateIndex } = useCarousel(
    carouselItems.length,
    setParentIndex
  );

  return (
    <Box
      position={"relative"}
      height={["200px", "300px", "270px"]}
      bottom={[10, 0]}
      mx={30}
      pb={10}
    >
      <CarouselControls onPrev={prevSlide} onNext={nextSlide} />

      <HStack
        spacing={5}
        justifyContent="center"
        alignItems="center"
        height={"200px"}
        width={`${(carouselItems.length * 100) / 3}%`}
        transform={`translateX(-${
          (currentIndex - 1) * (100 / carouselItems.length)
        }%)`}
        transition="transform 0.5s ease-in-out"
      >
        {carouselItems.map((item, index) => {
          let opacity = 1;
          let pointerEvents: "auto" | "none" = "auto";
          const distance = Math.abs(currentIndex - index);

          if (distance === 1) {
            opacity = 0.8;
            pointerEvents = "auto";
          } else if (distance > 1) {
            opacity = 0;
            pointerEvents = "none";
          }

          if (currentIndex === 0 && index === 2) {
            opacity = 0.8;
            pointerEvents = "auto";
          }

          return (
            <Box
              key={index}
              onClick={() => (currentIndex === index ? "" : updateIndex(index))}
              transition="opacity 0.5s ease-in-out, pointer-events 0.5s ease-in-out"
              width={`${100 / carouselItems.length}%`}
              opacity={opacity}
              cursor={distance <= 1 ? "pointer" : "default"}
              pointerEvents={pointerEvents}
            >
              <CarouselItem {...item} isSelected={index === currentIndex} />
            </Box>
          );
        })}
      </HStack>
      <CarouselDots
        itemsCount={carouselItems.length}
        currentIndex={currentIndex}
        onDotClick={updateIndex}
      />
    </Box>
  );
};

export default Carousel;
