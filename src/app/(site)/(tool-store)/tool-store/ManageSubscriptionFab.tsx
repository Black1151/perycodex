"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, useTheme, useBreakpointValue, Container } from "@chakra-ui/react";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useBasket } from "./useBasket";
import MiniConfetti from "./MiniConfetti";

export function ManageSubscriptionFab() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { basket } = useBasket();
  const controls = useAnimation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
  const fabRef = useRef<HTMLDivElement>(null);
  const prevBasketLength = useRef<number>(0);
  const isFirstRender = useRef(true);

  const fabVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
    bounce: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.2, 0.5, 1],
      },
    },
  };

  useEffect(() => {
    const basketContentLength = basket?.content?.length ?? 0;

    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevBasketLength.current = basketContentLength;
      return;
    }

    // Only show confetti when items are added (not removed)
    if (basketContentLength > prevBasketLength.current) {
      controls.start("bounce");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    prevBasketLength.current = basketContentLength;
  }, [basket?.content?.length, controls]);

  useEffect(() => {
    const updatePosition = () => {
      if (fabRef.current) {
        const rect = fabRef.current.getBoundingClientRect();
        setFabPosition({
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY,
        });
      }
    };

    // Update position initially and on window resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return (
    <Container
      position={isMobile ? "fixed" : "relative"}
      bottom={isMobile ? 145 : 14}
      right={12}
      left={isMobile ? 2 : 0}
      maxW="container.xl"
      mx="auto"
      px={[3, 3, 78]}
      zIndex={1000}
    >
      <Box
        position="absolute"
        right={isMobile ? "auto" : 0}
        left={isMobile ? 0 : "auto"}
      >
        {showConfetti && (
          <MiniConfetti
            show={showConfetti}
            position={fabPosition}
          />
        )}
        <motion.div
          ref={fabRef}
          initial="initial"
          animate={controls}
          whileHover="hover"
          variants={fabVariants}
          style={{
            cursor: "pointer",
          }}
          onClick={() => router.push("/tool-store/manage-subscription")}
        >
          <Box
            w="64px"
            h="64px"
            borderRadius="full"
            bg={theme.colors.elementBG}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            backdropFilter="blur(2px)"
            _hover={{
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              bg: theme.colors.elementBG,
            }}
          >
            <ShoppingCart
              sx={{
                color: theme.colors.primary,
                fontSize: "32px",
              }}
            />
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
} 