import { Box } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";

interface RotatingChevronProps {
  placement: "left" | "right";
  onClick: () => void;
  drawerState: "closed" | "half-open" | "fully-open";
  color?: string;
  position?: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
  };
}

const MotionBox = motion(Box);

export const RotatingChevron: React.FC<RotatingChevronProps> = ({
  placement,
  onClick,
  color = "white",
  position,
}) => {
  const [isTouch, setIsTouch] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleTouchStart = () => {
    setIsTouch(true);
    setRotation(placement === "right" ? -180 : 180);
    setTimeout(() => {
      onClick();
      setRotation(0);
    }, 300);
  };

  const handleClick = () => {
    if (!isTouch) {
      onClick();
    }
    setIsTouch(false);
  };

  return (
    <MotionBox
      as="div"
      aria-label={`Toggle ${placement} Drawer`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      position="fixed"
      {...position}
      zIndex={1}
      cursor="pointer"
      color={color}
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxSize="60px"
      opacity={0.7}
      whileHover={{
        opacity: 1,
        scale: 1.4,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 1.2 }}
    >
      <MotionBox
        initial={{ rotate: 0 }}
        animate={{ rotate: rotation }}
        whileHover={{ rotate: placement === "right" ? -180 : 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {placement === "left" ? (
          <ChevronLeft style={{ fontSize: "3rem" }} />
        ) : (
          <ChevronRight style={{ fontSize: "3rem" }} />
        )}
      </MotionBox>
    </MotionBox>
  );
};
