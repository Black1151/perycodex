"use client";

import { Box, VStack, Text, Button, useTheme } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CarouselItemProps } from "./CarouselItem";
import { useRouter } from "next/navigation";
import Carousel from "./Carousel"; // Make sure to import the Carousel component

export interface CarouselDisplayProps {
  carouselItems: CarouselItemProps[];
}

const CarouselDisplay = ({ carouselItems }: CarouselDisplayProps) => {
  const fallbackImage = "/assets/apps/invoicePro/invoiceProBG.png";
  const [layers, setLayers] = useState([
    {
      id: 0,
      image: carouselItems[1]?.backgroundImage || fallbackImage,
      opacity: 1,
    },
  ]);
  const [nextLayerId, setNextLayerId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showInfoBox, setShowInfoBox] = useState(true);

  const router = useRouter();

  const setIndex = (index: number) => {
    setShowInfoBox(false);

    setTimeout(() => {
      const newLayer = {
        id: nextLayerId,
        image: carouselItems[index].backgroundImage || fallbackImage,
        opacity: 0,
      };
      setLayers([...layers, newLayer]);
      setNextLayerId(nextLayerId + 1);
      setCurrentIndex(index);

      setTimeout(() => {
        setLayers((prevLayers) =>
          prevLayers.map((layer, idx) => {
            if (idx === prevLayers.length - 1) {
              return { ...layer, opacity: 1 };
            }
            return { ...layer, opacity: 0 };
          })
        );
      }, 10);

      setTimeout(() => {
        setLayers((prevLayers) => prevLayers.slice(1));
        setShowInfoBox(true);
      }, 300);
    }, 500);
  };

  useEffect(() => {
    setShowInfoBox(true);
  }, []);

  const theme = useTheme();

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
    >
      {layers.map((layer) => (
        <Box
          key={layer.id}
          flex="1"
          backgroundImage={layer.image}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          opacity={layer.opacity}
          zIndex={1}
          transition="opacity 1s ease-in-out"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
        />
      ))}
      <Box
        zIndex={2}
        display="flex"
        flex="1"
        flexDirection="column"
        mt={[20, null, 0]}
        position={["static", "absolute"]}
        top={200}
        left={[0, 300]}
      >
        <VStack
          spacing={8}
          padding="10px"
          background={`linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`}
          color="white"
          borderRadius="md"
          maxW="600px"
          mx="auto"
          textAlign="center"
          position="relative"
          transition="left 0.4s ease-in-out"
          left={showInfoBox ? ["0", "0"] : ["-600px", "-2000px"]}
          p={12}
        >
          <Text fontSize="3xl">{carouselItems[currentIndex].name}</Text>
          <Text fontSize="md">{carouselItems[currentIndex].description}</Text>
          <Button
            bg={theme.colors.seduloRed}
            color="white"
            _hover={{
              bg: theme.colors.perygonPink,
            }}
            onClick={() => router.push(carouselItems[currentIndex].appUrl)}
          >
            Open {carouselItems[currentIndex].name}
          </Button>
        </VStack>
      </Box>

      <Box
        zIndex={3}
        position="absolute"
        bottom={10}
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
      </Box>
    </Box>
  );
};

export default CarouselDisplay;
