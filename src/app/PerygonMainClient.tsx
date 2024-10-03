"use client";

import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { Box, useTheme, VStack } from "@chakra-ui/react";
import { NavBar, NavBarProps } from "./NavBar";
import { Footer } from "@/components/layout/Footer";

interface PerygonMainClientProps {
  carouselItems: CarouselItemProps[];
  navbarProps: NavBarProps;
}

export const PerygonMainClient: React.FC<PerygonMainClientProps> = ({
  carouselItems,
  navbarProps,
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
      <NavBar {...navbarProps} />
      <CarouselDisplay carouselItems={carouselItems} />;
      <Footer />
    </Box>
  );
};
