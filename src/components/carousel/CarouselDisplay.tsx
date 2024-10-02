"use client";

import { Box, VStack, Text, Button, useTheme } from "@chakra-ui/react";
import Carousel from "./Carousel";
import { useState, useEffect } from "react";
import { CarouselItemProps } from "./CarouselItem";

export interface carouselDisplayProps {
  carouselItems: CarouselItemProps[];
}

const CarouselDisplay = ({ carouselItems }: carouselDisplayProps) => {
  const [layers, setLayers] = useState([
    { id: 0, image: carouselItems[1].backgroundImage, opacity: 1 },
  ]);
  const [nextLayerId, setNextLayerId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showInfoBox, setShowInfoBox] = useState(true);

  const setIndex = (index: number) => {
    setShowInfoBox(false);

    setTimeout(() => {
      const newLayer = {
        id: nextLayerId,
        image: carouselItems[index].backgroundImage,
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
      }, 1000);
    }, 500);
  };

  useEffect(() => {
    setShowInfoBox(true);
  }, []);

  // const theme = useTheme();

  return (
    <VStack height="1000px" position="relative">
      {layers.map((layer) => (
        <Box
          key={layer.id}
          position="absolute"
          top={100}
          left={0}
          right={0}
          bottom={0}
          backgroundImage={layer.image}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          opacity={layer.opacity}
          transition="opacity 1s"
        />
      ))}

      <VStack
        position="absolute"
        spacing={8}
        top={120}
        left={showInfoBox ? [0, 300] : -500}
        maxW={"450px"}
        transition="left 0.5s"
        padding="10px"
        backgroundColor="rgba(0, 0, 0, 0.7)"
        color="white"
        borderRadius="md"
        zIndex={2}
        p={5}
      >
        <Text fontSize="3xl">{carouselItems[currentIndex].name}</Text>
        <Text fontSize="md">{carouselItems[currentIndex].description}</Text>
        <Button
          bg="red"
          color="white"
          _hover={{
            bg: "green",
          }}
        >
          Open {carouselItems[currentIndex].name}
        </Button>
      </VStack>

      <Box zIndex={3} position="absolute" bottom={10}>
        <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
      </Box>
    </VStack>
  );
};

export default CarouselDisplay;
