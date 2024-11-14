"use client";

import {
  VStack,
  Text,
  Button,
  useTheme,
  Flex,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
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
          }),
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
    <VStack
      flex={1}
      justifyContent={["space-between", "space-around"]}
      p={[5, 10]}
      pb={[20]}
      overflow="hidden"
      backgroundImage={layers[layers.length - 1].image}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      transition="background-image 1s ease-in-out"
    >
      <Flex
        flexDirection="column"
        gap={5}
        alignItems="flex-start"
        mt={[20, 10]}
        justifyContent="flex-start"
        background={`linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`}
        color="white"
        borderRadius="md"
        maxW="600px"
        textAlign="left"
        transition="transform 0.4s ease-in-out"
        transform={showInfoBox ? "translateX(0)" : "translateX(-2000px)"}
        p={[8, 12]}
        minHeight={340}
      >
        <HStack gap={8}>
          <Image
            src={carouselItems[currentIndex].iconImage}
            alt={carouselItems[currentIndex].name}
            height={100}
            width={100}
          />

          <Text fontSize="3xl">{carouselItems[currentIndex].name}</Text>
        </HStack>
        <Text fontSize="md">{carouselItems[currentIndex].description}</Text>
        <Button
          bg={theme.colors.seduloRed}
          color="white"
          _hover={{
            bg: theme.colors.perygonPink,
          }}
          onClick={() => {
            setToolId(carouselItems[currentIndex].toolId);
            setWorkflowId(carouselItems[currentIndex].toolWfId);
            router.push(
              `${carouselItems[currentIndex].appUrl}?toolId=${carouselItems[currentIndex].toolId}&wfId=${carouselItems[currentIndex].toolWfId}`,
            );
          }}
        >
          Open {carouselItems[currentIndex].name}
        </Button>
      </Flex>
      <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
    </VStack>
  );
};

export default CarouselDisplay;
