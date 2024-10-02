"use client";

import Carousel from "@/components/carousel/Carousel";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { Box, useTheme, VStack } from "@chakra-ui/react";

interface PerygonMainClientProps {
  carouselItems: CarouselItemProps[];
}

export const PerygonMainClient: React.FC<PerygonMainClientProps> = ({
  carouselItems,
}) => {
  const theme = useTheme();
  return (
    <Box
      minH="100vh"
      width="100%"
      overflowX="hidden"
      p={10}
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      <CarouselDisplay carouselItems={carouselItems} />;
    </Box>
  );
};
