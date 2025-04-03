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
      // Make the container positioned so absolute children can overlay
      position="relative"
      mt={[20, 30]}
      flex={1}
      // justifyContent={["space-between", "space-around"]}
      justifyContent="flex-end"
      p={[5, 10]}
      pb={[20]}
      overflow="hidden"
      // We’ll remove the direct backgroundImage and let the 'layers' array do it below
    >
      {/* This maps each layer to a Box that handles the fade-in/out */}
      {layers.map((layer) => (
        <>
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
            transition="opacity 0.3s ease-in-out"
            // Put these layers behind the gradient overlay
            zIndex={0}
          />

          {/* <Box
            position="absolute"
            bgColor="rgba(0, 0, 0, 0.8)"
            w="100%"
            h={400}
            zIndex={1}
          /> */}
        </>
      ))}

      {/* Gradient Overlay */}
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

      {/* Content above the gradient */}
      <VStack zIndex={2} w="100%">
        <Carousel carouselItems={carouselItems} setParentIndex={setIndex} />
        {/* Any additional content goes here */}
      </VStack>
    </VStack>
  );
};

export default CarouselDisplay;

// <Flex
// flexDirection="column"
// gap={5}
// alignItems="flex-start"
// justifyContent="space-between"
// // background={theme.gradients.secondaryGradientTransparent}
// background={"rgba(0, 0, 0, 0.7)"}
// color="white"
// borderRadius="md"
// maxW="600px"
// textAlign="left"
// transition="transform 0.4s ease-in-out"
// transform={showInfoBox ? "translateX(0)" : "translateX(-2000px)"}
// p={[8, 12]}
// height={500}
// >
// <HStack gap={8}>
//   <Image
//     src={carouselItems[currentIndex].logoImage}
//     // fallback={
//     //   <Box
//     //     display="flex"
//     //     alignItems="center"
//     //     justifyContent="center"
//     //     height="100px"
//     //     width="100px"
//     //     bg="gray.100"
//     //     borderRadius="full"
//     //   >
//     //     {/* <Construction
//     //       sx={{
//     //         color: "var(--chakra-colors-primary)",
//     //         fontSize: "2rem",
//     //       }}
//     //     /> */}
//     //   </Box>
//     // }
//     alt={carouselItems[currentIndex].name}
//     height={120}
//     // width={100}
//   />

//   {/* <Text fontSize="3xl">{carouselItems[currentIndex].name}</Text> */}
// </HStack>
// <Text fontSize="md">{carouselItems[currentIndex].description}</Text>
// {!carouselItems[currentIndex].isUAGLocked && (
//   <Flex width="100%" justifyContent="flex-end">
//     <Box>
//       <Button
//         variant="primary"
//         onClick={() => {
//           setToolId(carouselItems[currentIndex].toolId);
//           setWorkflowId(carouselItems[currentIndex].toolWfId);
//           router.push(
//             `${carouselItems[currentIndex].appUrl}?toolId=${carouselItems[currentIndex].toolId}&wfId=${carouselItems[currentIndex].toolWfId}`
//           );
//         }}
//       >
//         Open {carouselItems[currentIndex].name}
//       </Button>
//     </Box>
//   </Flex>
// )}
// </Flex>
