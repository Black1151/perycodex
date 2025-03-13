"use client";

import {
  Button,
  Flex,
  HStack,
  Image,
  Text,
  Box,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CarouselItemProps } from "./CarouselItem";
import { useRouter } from "next/navigation";
import Carousel from "./Carousel";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { Construction } from "@mui/icons-material";

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
        background={theme.gradients.secondaryGradientTransparent}
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
            fallback={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100px"
                width="100px"
                bg="gray.100"
                borderRadius="full"
              >
                <Construction
                  sx={{
                    color: "var(--chakra-colors-perygonPink)",
                    fontSize: "2rem",
                  }}
                />
              </Box>
            }
            alt={carouselItems[currentIndex].name}
            height={100}
            width={100}
          />

          <Text fontSize="3xl">{carouselItems[currentIndex].name}</Text>
        </HStack>
        <Text fontSize="md">{carouselItems[currentIndex].description}</Text>
        <Flex>
          <Button
            variant="primary"
            onClick={() => {
              setToolId(carouselItems[currentIndex].toolId);
              setWorkflowId(carouselItems[currentIndex].toolWfId);
              router.push(
                `${carouselItems[currentIndex].appUrl}?toolId=${carouselItems[currentIndex].toolId}&wfId=${carouselItems[currentIndex].toolWfId}`
              );
            }}
          >
            Open {carouselItems[currentIndex].name}
          </Button>
        </Flex>
      </Flex>
      <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
    </VStack>
  );
};

export default CarouselDisplay;
