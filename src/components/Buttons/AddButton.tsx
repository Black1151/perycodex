import React from "react";
import { Button } from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
  return (
    <Button
      leftIcon={<AddIcon />}
      onClick={onClick}
      backgroundColor="lightGreen"
      color="white"
      _hover={{ backgroundColor: "seduloGreen" }}
    >
      {["", label]}
    </Button>
  );
};

export default AddButton;
