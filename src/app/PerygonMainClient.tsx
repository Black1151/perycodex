"use client";

import { useEffect, useState } from "react";
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
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (user?.role === "EU") {
      logoutUser();
    }
  }, [user]);

  useEffect(() => {
    localStorage.removeItem("toolId");
    localStorage.removeItem("workflowId");
    localStorage.removeItem("currentBusinessProcessInstanceId");
    localStorage.removeItem("currentWorkflowInstanceId");
  }, []);

  useEffect(() => {
    if (showNoToolsModal) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showNoToolsModal]);

  useEffect(() => {
    if (countdown === -5) {
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

  console.log(carouselItems);

  carouselItems = [
    {
      toolId: "1",
      logoImage:
        "https://perygonblob.blob.core.windows.net/public/logo-happiness-score.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      iconImage:
        "https://perygonblob.blob.core.windows.net/public/Perygon_Happiness_score_icon.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      thumbNailImage: "/carousel/logos/happiness-score-logo-new.webp",
      backgroundImage: "/carousel/happiness-score-carousel-bg.webp",
      alt: "Happiness Score",
      name: "Happiness Score",
      description:
        "Stay in tune with your team's happiness with weekly ratings and insightful trends. Empower your business with real-time feedback, enabling direct support for employees and fostering a happier, more connected workplace.",
      appUrl: "/happiness-score",
      toolWfId: "1",
      isUAGLocked: false,
    },
    {
      toolId: "2",
      logoImage:
        "https://perygonblob.blob.core.windows.net/public/eNPS-235x91_white_colour.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      iconImage:
        "https://perygonblob.blob.core.windows.net/public/eNPS_White-on-pink_800x800.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      thumbNailImage: "/carousel/logos/enps-logo-new.webp",
      backgroundImage: "/carousel/enps-carousel-bg.webp",
      alt: "Employee NPS",
      name: "Employee NPS",
      description:
        "Employee Net Promoter Score (eNPS) is a tool used by organizations to measure employee engagement and satisfaction. It’s an adaptation of the traditional Net Promoter Score (NPS) used to gauge customer loyalty but applied internally....",
      appUrl: "/enps",
      toolWfId: "2",
      isUAGLocked: false,
    },
    {
      toolId: "3",
      logoImage:
        "https://perygonblob.blob.core.windows.net/public/Client%20satisfaction235x92-8-v2.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      iconImage:
        "https://perygonblob.blob.core.windows.net/public/Client-satisfaction-icon-green_800x800.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      thumbNailImage: "/carousel/logos/client-satisfaction-logo-new.png",
      backgroundImage: "/carousel/client-satisfaction-bg.webp",
      alt: "Client Satisfaction",
      name: "Client Satisfaction",
      description:
        "A client feedback tool designed to gather insights about how satisfied your clients are with your services and staff. Honest opinions help to ensure you meet client expectations and how to improve your offerings.",
      appUrl: "/client-satisfaction",
      toolWfId: "3",
      isUAGLocked: false,
    },
    {
      toolId: "4",
      logoImage:
        "https://perygonblob.blob.core.windows.net/public/Perygon_Business_Score_logo.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      iconImage: "/carousel/logos/business-score-icon-new.png",
      thumbNailImage: "/carousel/logos/business-score-logo-new.webp",
      backgroundImage: "/carousel/business-score-carousel-bg.webp",
      alt: "Business Score",
      name: "Business Score",
      description:
        "Measure the maturity of your Business by applying a comprehensive scoring matrix...",
      appUrl: "/tester",
      toolWfId: "4",
      isUAGLocked: false,
    },
    {
      toolId: "19",
      logoImage:
        "https://perygonblob.blob.core.windows.net/public/Client%20satisfaction235x92-8-v2.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      iconImage:
        "https://perygonblob.blob.core.windows.net/public/Client-satisfaction-icon-green_800x800.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      thumbNailImage: "/carousel/logos/client-satisfaction-logo-new.png",
      backgroundImage:
        "https://perygonblob.blob.core.windows.net/public/Client satisfactionDark-100.jpg?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D",
      alt: "Client Satisfaction #2",
      name: "Client Satisfaction #2",
      description:
        "A client feedback tool designed to gather insights about how satisfied your clients are with your services and staff. Honest opinions help to ensure you meet client expectations and how to improve your offerings.",
      appUrl: "/client-satisfaction",
      toolWfId: "14",
      isUAGLocked: false,
    },
  ];

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
