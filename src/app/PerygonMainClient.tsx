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
import { useRouter } from "next/navigation";

interface PerygonMainClientProps {
  carouselItems: CarouselItemProps[];
  showNoToolsModal: boolean;
}

export const PerygonMainClient: React.FC<PerygonMainClientProps> = ({
  carouselItems,
  showNoToolsModal,
}) => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

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
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Flex flex={1} overflow="hidden" width="100%">
      {!showNoToolsModal && <CarouselDisplay carouselItems={carouselItems} />}
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
