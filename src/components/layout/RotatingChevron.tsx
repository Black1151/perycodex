import { Box } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";

interface RotatingChevronProps {
  placement: "left" | "right";
  onClick: () => void;
}

const MotionBox = motion(Box);

export const RotatingChevron: React.FC<RotatingChevronProps> = ({
  placement,
  onClick,
}) => {
  return (
    <MotionBox
      as="div"
      aria-label={`Toggle ${placement} Drawer`}
      onClick={onClick}
      position="fixed"
      left={placement === "left" ? 0 : "auto"}
      right={placement === "right" ? 0 : "auto"}
      top="50%"
      zIndex={1}
      cursor="pointer"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxSize="80px"
      opacity={0.7}
      whileHover={{
        opacity: 1,
        scale: 1.4,
        x: placement === "left" ? 30 : -30,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 1.2 }}
    >
      <MotionBox
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {placement === "left" ? (
          <ChevronLeft style={{ fontSize: "4rem" }} />
        ) : (
          <ChevronRight style={{ fontSize: "4rem" }} />
        )}
      </MotionBox>
    </MotionBox>
  );
};
