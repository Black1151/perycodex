"use client";

import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import { Box, useTheme } from "@chakra-ui/react";
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
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100%"
      overflow="hidden"
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      <NavBar {...navbarProps} />
      <Box flexGrow={1} mt="80px" mb={[0, null, "53px"]} display="flex">
        <CarouselDisplay carouselItems={carouselItems} />
      </Box>
      <Footer />
    </Box>
  );
};
