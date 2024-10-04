import { motion } from "framer-motion";
import { Box, useTheme } from "@chakra-ui/react";

const randomize = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const ShapeAnimation = () => {
  const theme = useTheme();

  const shapes = Array.from({ length: 5 }, (_, index) => ({
    id: index,
    size: randomize(30, 100),
    left: `${randomize(0, 90)}%`,
    duration: randomize(4, 10),
    color: index % 2 === 0 ? theme.colors.perygonPink : theme.colors.seduloRed,
  }));

  return (
    <>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          style={{
            position: "absolute",
            bottom: "-100px",
            left: shape.left,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: "transparent",
            border: `1px solid ${shape.color}`,
            borderRadius: "50%",
            zIndex: 0,
          }}
          animate={{
            y: ["110vh", "-1000px"],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: shape.duration,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default ShapeAnimation;
