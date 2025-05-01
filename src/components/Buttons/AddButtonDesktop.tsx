// components/AddButtonDesktop.tsx
import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { Add } from "@mui/icons-material";

interface AddButtonDesktopProps {
  label: string;
  onAddButtonClick: () => void;
  isLoading?: boolean;
  /** A React component for the icon (defaults to MUI’s Add) */
  IconComponent?: React.ComponentType<any>;
}

const AddButtonDesktop: React.FC<AddButtonDesktopProps> = ({
  label,
  onAddButtonClick,
  isLoading = false,
  IconComponent = Add,
}) => {
  const iconSpacing = { marginRight: "8px" };
  return (
    <Button
      variant="workflowStart"
      position="relative"
      onClick={onAddButtonClick}
      minW="48px"
      minH="48px"
      borderRadius="md"
      isLoading={isLoading}
    >
      <IconComponent style={iconSpacing} />
      <Text fontSize="md">{label}</Text>
    </Button>
  );
};

export default AddButtonDesktop;
