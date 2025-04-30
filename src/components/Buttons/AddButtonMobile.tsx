// components/AddButtonMobile.tsx
import React from "react";
import { Button } from "@chakra-ui/react";
import { Add } from "@mui/icons-material";

interface AddButtonMobileProps {
  onAddButtonClick: () => void;
  isLoading?: boolean;
  /** A React component for the icon (defaults to MUI’s Add) */
  IconComponent?: React.ComponentType<any>;
  workflow?: boolean;
}

const AddButtonMobile: React.FC<AddButtonMobileProps> = ({
  onAddButtonClick,
  isLoading = false,
  IconComponent = Add,
  workflow = true,
}) => (
  <Button
    variant="workflowStart"
    position="fixed"
    bottom={workflow ? "110px" : ["10px", "45px"]}
    right="12px"
    onClick={onAddButtonClick}
    minW="48px"
    minH="48px"
    aspectRatio={1}
    borderRadius="full"
    isLoading={isLoading}
    zIndex={20}
  >
    <IconComponent />
  </Button>
);

export default AddButtonMobile;
