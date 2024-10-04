import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  keyframes,
  useTheme,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";
import ShapeAnimation from "./ShapeAnimation";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";

interface NavigationDrawerProps {
  drawerHeader: string;
  placement: "left" | "right";
  children: React.ReactNode;
}

export function NavigationDrawer({
  drawerHeader,
  placement,
  children,
}: NavigationDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const theme = useTheme();

  const MotionBox = motion(Box);

  const randomizeShadow = () => {
    const shadowSize = Math.random() * 20 + 5;
    const pulseDuration = Math.random() * 3 + 1;
    return { shadowSize, pulseDuration };
  };

  const { shadowSize, pulseDuration } = randomizeShadow();

  const innerShadow =
    placement === "left"
      ? `inset -5px 0 5px 1px rgba(255, 105, 180, 0.6)`
      : `inset 5px 0 5px 1px rgba(255, 105, 180, 0.6)`;

  const pulseAnimation = keyframes`
        0% {
          box-shadow: 0 0 10px 2px rgba(255, 105, 180, 0.6), ${innerShadow};
        }
        50% {
          box-shadow: 0 0 ${shadowSize}px 4px rgba(255, 105, 180, 1), ${innerShadow};
        }
        100% {
          box-shadow: 0 0 10px 2px rgba(255, 105, 180, 0.6), ${innerShadow};
        }
      `;

  return (
    <>
      {placement === "left" ? (
        <MotionBox
          as="div"
          aria-label="Open Left Drawer"
          onClick={onOpen}
          position="fixed"
          left={0}
          top="50%"
          zIndex="overlay"
          cursor="pointer"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxSize="100px"
          opacity={0.7}
          whileHover={{
            opacity: 1,
            scale: 1.4,
            x: 30,
            rotate: 360,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
          whileTap={{ scale: 1.2 }}
        >
          <ChevronRight style={{ fontSize: "6rem" }} />
        </MotionBox>
      ) : (
        <MotionBox
          as="div"
          aria-label="Open Right Drawer"
          onClick={onOpen}
          position="fixed"
          right={0}
          top="50%"
          zIndex="overlay"
          cursor="pointer"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxSize="100px"
          opacity={0.7}
          whileHover={{
            opacity: 1,
            scale: 1.4,
            x: -30,
            rotate: 360,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
          whileTap={{ scale: 1.2 }}
        >
          <ChevronLeft style={{ fontSize: "6rem" }} />
        </MotionBox>
      )}

      <Drawer isOpen={isOpen} placement={placement} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent
            position="relative"
            animation={`${pulseAnimation} ${pulseDuration}s infinite`}
          >
            <DrawerCloseButton />
            <DrawerHeader>
              <LetterFlyIn
                duration={0.03}
                fontSize={30}
                color={theme.colors.perygonPink}
              >
                {drawerHeader}
              </LetterFlyIn>
            </DrawerHeader>

            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              zIndex={0}
              overflow="hidden"
            >
              <ShapeAnimation />
            </Box>
            <DrawerBody position="relative" zIndex={1}>
              {children}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
