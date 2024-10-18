"use client";

import { useState, useEffect } from "react";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import {
  Box,
  useTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { NavBar, NavBarProps } from "./NavBar";
import { Footer } from "@/components/layout/Footer";

interface PerygonMainClientProps {
  carouselItems: CarouselItemProps[];
  navbarProps: NavBarProps;
  showNoToolsModal: boolean;
}

export const PerygonMainClient: React.FC<PerygonMainClientProps> = ({
  carouselItems,
  navbarProps,
  showNoToolsModal,
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (showNoToolsModal) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showNoToolsModal]);

  useEffect(() => {
    if (countdown === 0) {
      logoutUser();
    }
  }, [countdown]);

  const logoutUser = async () => {
    try {
      const response = await fetch("/api/auth/sign-out", { method: "POST" });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box width="100%" height="100vh">
      <VStack
        bgColor="red"
        flex={1}
        // mt={61}
        minHeight="100%"
        width="100%"
        gap={0}
        justifyContent="space-between"
      >
        <NavBar {...navbarProps} />
        {!showNoToolsModal && <CarouselDisplay carouselItems={carouselItems} />}

        <Footer />
      </VStack>
      <Modal
        isOpen={showNoToolsModal}
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>No Tools Subscribed</ModalHeader>
          <ModalBody>
            <Text>
              You are not currently subscribed to any tools, please contact
              sales.
            </Text>
            <Text mt={4}>Seconds until logout: {countdown}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
