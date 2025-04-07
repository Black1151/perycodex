"use client";

import { Box, VStack, useTheme } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CarouselItemProps } from "./CarouselItem";
import { useRouter } from "next/navigation";
import Carousel from "./Carousel";
import { useWorkflow } from "@/providers/WorkflowProvider";

export interface CarouselDisplayProps {
  carouselItems: CarouselItemProps[];
}

const CarouselDisplay = ({ carouselItems }: CarouselDisplayProps) => {
  const fallbackImage = "/assets/apps/invoicePro/invoiceProBG.png";
  const [layers, setLayers] = useState([
    {
      id: 0,
      image: carouselItems[0]?.backgroundImage || fallbackImage,
      opacity: 1,
    },
  ]);

  const [nextLayerId, setNextLayerId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfoBox, setShowInfoBox] = useState(true);
  const { setToolId, setWorkflowId } = useWorkflow();
  const router = useRouter();
  const theme = useTheme();

  const setIndex = (index: number) => {
    setShowInfoBox(false);

    const newLayer = {
      id: nextLayerId,
      image: carouselItems[index]?.backgroundImage || fallbackImage,
      opacity: 0,
    };

    setLayers((prev) => [...prev, newLayer]);
    setNextLayerId((prev) => prev + 1);
    setCurrentIndex(index);

    requestAnimationFrame(() => {
      setLayers((prevLayers) =>
        prevLayers.map((layer) =>
          layer.id === newLayer.id
            ? { ...layer, opacity: 1 }
            : { ...layer, opacity: 0 }
        )
      );
    });

    setTimeout(() => {
      setLayers((prevLayers) => prevLayers.slice(1));
      setShowInfoBox(true);
    }, 500);
  };

  useEffect(() => {
    setShowInfoBox(true);
  }, []);

  return (
    <VStack
      position="relative"
      mt={[20, 30]}
      flex={1}
      justifyContent="flex-end"
      p={[5, 10]}
      pb={[20]}
      overflow="hidden"
    >
      {layers.map((layer) => (
        <Box
          key={layer.id}
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          backgroundImage={layer.image}
          backgroundPosition={["center", "center 30px"]}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          opacity={layer.opacity}
          transition="opacity 0.5s ease-in-out"
          zIndex={0}
        />
      ))}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgGradient="linear(to-t, rgba(0, 0, 0, 0.9), transparent)"
        pointerEvents="none"
        zIndex={1}
      />
      <Box
        position="absolute"
        top={showInfoBox ? "100" : "-300px"}
        left="50%"
        transform="translateX(-50%)"
        width="600px"
        height="300px"
        bg="rgba(0, 0, 0, 0.7)"
        transition="top 0.5s ease-in-out"
        zIndex={3}
        borderRadius="lg"
      ></Box>
      <VStack zIndex={2} w="100%">
        <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
      </VStack>
    </VStack>
  );
};

export default CarouselDisplay;
