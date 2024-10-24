"use client";

import { useState, useEffect } from "react";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Flex,
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
    <Flex flex={1} overflow="hidden">
      <NavBar {...navbarProps} />
      {!showNoToolsModal && <CarouselDisplay carouselItems={carouselItems} />}
      <Footer />
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
    </Flex>
  );
};
