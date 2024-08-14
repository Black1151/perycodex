import { useTheme, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface PerygonContatinerProps {
  children: ReactNode;
}

export const PerygonContainer: React.FC<PerygonContatinerProps> = ({
  children,
}) => {
  const theme = useTheme();

  return (
    <VStack
      minH="100vh"
      width="100%"
      overflowX="hidden"
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      {children}
    </VStack>
  );
};
