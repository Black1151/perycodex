import { Box, useTheme } from "@chakra-ui/react";

interface DotProps {
  isActive: boolean;
  onClick: () => void;
}

const Dot: React.FC<DotProps> = ({ isActive, onClick }) => {
  const theme = useTheme();

  return (
    <Box
      w={[2, 4]}
      h={[2, 4]}
      borderRadius="full"
      bg={isActive ? theme.colors.perygonPink : "white"}
      cursor="pointer"
      onClick={onClick}
      transition="background-color 0.3s ease"
    />
  );
};

export default Dot;
