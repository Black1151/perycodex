"use client";

import {useEffect, useState} from "react";
import CarouselDisplay from "@/components/carousel/CarouselDisplay";
import {CarouselItemProps} from "@/components/carousel/CarouselItem";
import {
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {useUser} from "@/providers/UserProvider";

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
    }, [])


    useEffect(() => {
        if (showNoToolsModal) {
            const timer = setInterval(() => {
                setCountdown((prevCount) => prevCount > 0 ? prevCount - 1 : 0);
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
            const response = await fetch("/api/auth/sign-out", {method: "POST"});
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
            {!showNoToolsModal && <CarouselDisplay carouselItems={carouselItems}/>}
            <Modal
                isOpen={showNoToolsModal}
                onClose={() => {
                }}
                closeOnOverlayClick={false}
                closeOnEsc={false}
            >
                <ModalOverlay/>
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
