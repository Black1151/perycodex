"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  useTheme,
  useBreakpointValue,
  Button,
  Flex,
} from "@chakra-ui/react";
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

  // ---------------------------------------------------------------- helpers
  const currentItem = carouselItems[currentIndex] ?? {
    description: "",
    logoImage: "",
    alt: "",
    appUrl: "#",
    toolId: "",
    toolWfId: "",
  };

  const handleStartClick = () => {
    if (!currentItem.appUrl) return;
    setToolId(currentItem.toolId);
    setWorkflowId(currentItem.toolWfId);
    router.push(currentItem.appUrl);
  };

  // ----------------------------------------------------------- index change
  const setIndex = (index: number) => {
    setShowInfoBox(false);
    const newLayer = {
      id: nextLayerId,
      image: carouselItems[index]?.backgroundImage || fallbackImage,
      opacity: 0,
    };
    setLayers((prev) => [...prev, newLayer]);
    setNextLayerId((prev) => prev + 1);

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
      setCurrentIndex(index);
      setLayers((prevLayers) => prevLayers.slice(1));
      setShowInfoBox(true);
    }, 500);
  };

  useEffect(() => setShowInfoBox(true), []);

  const infoBoxWidth = useBreakpointValue({ base: "90%", md: "600px" });

  // ---------------------------------------------------------------- render
  return (
    <VStack
      position="relative"
      mt={[10, 30]}
      flex={1}
      justifyContent="flex-end"
      p={[5, 10]}
      pb={20}
      overflow="hidden"
    >
      {/* background layers */}
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

      {/* dark gradient overlay */}
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

      {/* INFO BOX (logo + description) */}
      <Flex
        flexDirection="column"
        gap={6}
        position="absolute"
        top={showInfoBox ? "100px" : "-450px"}
        left="50%"
        transform="translateX(-50%)"
        width={infoBoxWidth}
        maxW="600px"
        minH="220px"
        px={[5, 8]}
        py={[6, 8]}
        bg="rgba(0, 0, 0, 0.75)"
        transition="top 0.5s ease-in-out"
        zIndex={3}
        borderRadius="lg"
        _hover={{ bg: "rgba(0, 0, 0, 0.85)" }}
        _focus={{
          outline: "none",
          boxShadow: `0 0 0 2px ${theme.colors.whiteAlpha[500]}`,
        }}
        cursor={currentItem.appUrl ? "pointer" : "default"}
        color="white"
        textAlign="center"
      >
        {currentItem.logoImage && (
          <Image
            src={currentItem.logoImage}
            alt={currentItem.alt}
            h="100px"
            mx="auto"
            objectFit="contain"
          />
        )}
        <Text fontSize="lg" noOfLines={[4, 5]}>
          {currentItem.description}
        </Text>
        <Button
          boxShadow="md"
          padding={[6, 8]}
          color="white"
          bgColor={theme.colors.primary}
          _hover={{
            bgColor: "white",
            color: theme.colors.primary,
          }}
          onClick={handleStartClick}
        >
          <Text fontFamily="Metropolis" fontSize={[25, 30]}>
            Start!
          </Text>
        </Button>
      </Flex>

      {/* carousel thumbnails / controls */}
      <VStack zIndex={2} w="100%">
        <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
      </VStack>
    </VStack>
  );
};

export default CarouselDisplay;
