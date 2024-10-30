import React, { useRef, useCallback, useState } from "react";
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
    <Box
      position={"relative"}
      height={"240px"}
      mx={30}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchMove={(e) => (touchEndX.current = e.touches[0].clientX)}
      onTouchEnd={handleSwipe}
    >
      <CarouselControls
        onPrev={() => debouncedSlide(prevSlide)}
        onNext={() => debouncedSlide(nextSlide)}
      />
      <Box>
        <HStack
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
          height={"240px"}
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
    </Box>
  );
};

export default Carousel;
