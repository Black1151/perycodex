import React, { useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
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

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const deltaX = touchStartX - touchEndX;
      const minSwipeDistance = 50;
      if (deltaX > minSwipeDistance) {
        nextSlide();
      } else if (deltaX < -minSwipeDistance) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <VStack
      position={"relative"}
      height={["200px", "300px", "270px"]}
      bottom={0}
      mx={[0, 30]}
      pb={10}
      gap={10}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
            <HStack
              key={index}
              onClick={() => (currentIndex === index ? "" : updateIndex(index))}
              transition="opacity 0.5s ease-in-out, pointer-events 0.5s ease-in-out"
              opacity={opacity}
              cursor={distance <= 1 ? "pointer" : "default"}
              pointerEvents={pointerEvents}
              width={["100%", 125, 200]}
              alignItems="center"
              justifyContent="center"
            >
              <CarouselItem {...item} isSelected={index === currentIndex} />
            </HStack>
          );
        })}
      </HStack>
      <CarouselDots
        itemsCount={carouselItems.length}
        currentIndex={currentIndex}
        onDotClick={updateIndex}
      />
    </VStack>
  );
};

export default Carousel;
