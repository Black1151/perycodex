import { ModalContent, ModalContentProps } from "@chakra-ui/react";

interface BigUpModalContentProps extends ModalContentProps {
  children: React.ReactNode;
}

export const BigUpModalContent: React.FC<BigUpModalContentProps> = ({
  children,
}) => {
  return (
    <ModalContent
      bg="perygonBlueTransparent"
      boxShadow="0 0 10px 2px rgba(255, 20, 147, 0.8)"
      mx={4}
    >
      {children}
    </ModalContent>
  );
};
