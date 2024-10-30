import React, { useRef, useCallback, useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import CarouselNavigationButton from "./CarouselNavigationButton";
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

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const debouncedSlide = useCallback(
    (action: () => void) => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        action();
      }
    },
    [isTransitioning]
  );

  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      debouncedSlide(nextSlide);
    }
    if (touchStartX.current - touchEndX.current < -50) {
      debouncedSlide(prevSlide);
    }
  };

  return (
    <VStack
      spacing={4}
      height={["150px", "240px"]}
      mx={30}
      mb={[0, 10]}
      position="relative"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchMove={(e) => (touchEndX.current = e.touches[0].clientX)}
      onTouchEnd={handleSwipe}
    >
      <CarouselNavigationButton
        direction="left"
        onClick={() => debouncedSlide(prevSlide)}
        top="40%"
        side={["-30px", "-40px"]}
      />
      <CarouselNavigationButton
        direction="right"
        onClick={() => debouncedSlide(nextSlide)}
        top="40%"
        side={["-30px", "-40px"]}
      />

      <Box flex={1} width="100%">
        <HStack
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
          height="100%"
          width={`${(carouselItems.length * 100) / 3}%`}
          transform={`translateX(-${
            (currentIndex - 1) * (100 / carouselItems.length)
          }%)`}
          transition="transform 0.5s ease-in-out"
          onTransitionEnd={() => setIsTransitioning(false)}
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
                onClick={() =>
                  currentIndex === index
                    ? null
                    : debouncedSlide(() => updateIndex(index))
                }
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
          onDotClick={(index) => debouncedSlide(() => updateIndex(index))}
        />
      </Box>
    </VStack>
  );
};

export default Carousel;
