"use client";

import { useEffect, useLayoutEffect } from "react";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import { CarouselItemProps } from "@/components/carousel/CarouselItem";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";

interface PerygonMainClientProps {
  carouselItems: CarouselItemProps[];
  showNoToolsModal: boolean;
}

export const PerygonMainClient: React.FC<PerygonMainClientProps> = ({
  carouselItems,
  showNoToolsModal,
}) => {
  const { user } = useUser();
  const router = useRouter();

  /**
   * IMPORTANT: CA users with no parentId are users who need to set up a company.
   */
  const newCompanyRegistration =
    user?.role === "CA" && user.customerId === null;

  /**
   * Perform the navigation in an effect so we don’t mutate router state during
   * the render phase (which triggers React’s setState‑in‑render warning).
   *
   * useLayoutEffect fires before the browser paints, eliminating any flicker.
   */
  useLayoutEffect(() => {
    if (newCompanyRegistration) {
      router.replace("/register-company");
    }
  }, [newCompanyRegistration, router]);

  // Client‑only clean‑up once the component actually mounts
  useEffect(() => {
    localStorage.removeItem("toolId");
    localStorage.removeItem("workflowId");
    localStorage.removeItem("currentBusinessProcessInstanceId");
    localStorage.removeItem("currentWorkflowInstanceId");
  }, []);

  // Nothing should be rendered while we’re about to redirect.
  if (newCompanyRegistration) {
    return null;
  }

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
            <Button
              mt={4}
              onClick={logoutUser}
              width="100%"
              loadingText="Logging out..."
            >
              Logout
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
