"use client";

import React, { useState, useMemo } from "react";
import {
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody,
  ModalFooter, Button, VStack, Box,
  Text, HStack, Divider, Image, useTheme,
  useRadio, useRadioGroup,
} from "@chakra-ui/react";
import { useBasketContext } from "./BasketContext";
import { CheckoutProduct } from "./types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// card‐style radio
const CardRadio = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps(), checkbox = getRadioProps();
  const cardBg = "grey";
  const cardBorder = "white";
  
  return (
    <Box as="label" flex="1">
      <input {...input}/>
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="md"
        boxShadow="md"
        _checked={{ bg: cardBg, borderColor: cardBorder }}
        _focus={{ boxShadow: "outline" }}
        px={4} py={3} textAlign="center" bg={cardBg}
      >
        <Text fontWeight="medium">{props.children}</Text>
      </Box>
    </Box>
  );
};

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { getCheckoutProducts } = useBasketContext();
  const products = getCheckoutProducts();
  const theme = useTheme();
  const cardBg = "grey";

  // billing cycle toggle
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "billingCycle",
    defaultValue: "monthly",
    onChange: v => setBillingCycle(v as any),
  });
  const radioGroup = getRootProps();

  const FLAT_ANNUAL_RATE = 0.15;

  const totalUsers = useMemo(() => {
    const toolProduct = products.find(p => p.isTool);
    return toolProduct?.quantity ?? 0;
  }, [products]);

  const {
    checkoutProducts,
    billingCycle,
    setBillingCycle,
    discountRate,
    pricing: { annList, annFlatDisc, annVolDisc, annNet, monList, monVolDisc, monNet },
  } = useBasketContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay/>
      <ModalContent borderRadius="lg" overflow="hidden">

        <ModalHeader px={6} py={4} bg={theme.colors.primary} color="white">
          <HStack justify="space-between">
            <Text fontSize="2xl" fontWeight="semibold">
              Checkout Summary
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white"/>

        <ModalBody px={6} py={4} bg={cardBg}>
          <VStack spacing={6} align="stretch">

            {/* Billing cycle selector */}
            <HStack {...radioGroup}>
              <CardRadio {...getRadioProps({ value:"monthly" })}>
                Monthly Billing
              </CardRadio>
              <CardRadio {...getRadioProps({ value:"annual" })}>
                Annual Billing
              </CardRadio>
            </HStack>

            {/* Product cards */}
            {products.length === 0 ? (
              <Text fontSize="lg" color="gray.500" textAlign="center">
                No products in your subscription.
              </Text>
            ) : products.map((p:CheckoutProduct) => {
              // per-user prices BEFORE vol discount
              const annPerUser = p.price! * (1 - FLAT_ANNUAL_RATE);
              const monPerUser = p.price! / 12;

              return (
                <Box
                  key={p.id}
                  p={4}
                  bg = "grey"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <HStack spacing={4} align="center">
                    {p.iconImageUrl && (
                      <Image
                        boxSize="48px"
                        src={p.iconImageUrl}
                        alt={p.name}
                        borderRadius="md"
                      />
                    )}
                    <VStack align="start" spacing={1} flex="1">
                      <Text fontSize="lg" fontWeight="bold">{p.name}</Text>
                      <Text fontSize="md">
                        {billingCycle === "annual"
                          ? `£${annPerUser.toFixed(2)} /user /yr`
                          : `£${monPerUser.toFixed(2)} /user /mo`}
                      </Text>
                    </VStack>
                    <Text>Qty: {p.quantity}</Text>
                  </HStack>
                </Box>
              );
            })}

          </VStack>
        </ModalBody>

        <Divider/>

        <ModalFooter px={6} py={4} bg="gray.100">
          <VStack flex="1" align="start" spacing={1}>
            <HStack justify="space-between" w="full">
              <Text fontWeight="medium">Subtotal</Text>
              <Text fontWeight="bold">
                {billingCycle === "annual"
                  ? `£${annList.toFixed(2)}`
                  : `£${monList.toFixed(2)}/mo`}
              </Text>
            </HStack>

            {billingCycle === "annual" && (
              <HStack justify="space-between" w="full">
                <Text fontWeight="medium">15% Annual Discount</Text>
                <Text fontWeight="bold" color="green.600">
                  -£{annFlatDisc.toFixed(2)}
                </Text>
              </HStack>
            )}

            <HStack justify="space-between" w="full">
              <Text fontWeight="medium">
                User Volume Discount ({(discountRate * 100).toFixed(0)}%)
              </Text>
              <Text fontWeight="bold" color="green.600">
                {billingCycle === "annual"
                  ? `-£${annVolDisc.toFixed(2)}`
                  : `-£${monVolDisc.toFixed(2)}/mo`}
              </Text>
            </HStack>

            <Divider />

            <HStack justify="space-between" w="full">
              <Text fontSize="lg" fontWeight="semibold">Total</Text>
              <Text fontSize="lg" fontWeight="semibold">
                {billingCycle === "annual"
                  ? `£${annNet.toFixed(2)}`
                  : `£${monNet.toFixed(2)}/mo`}
              </Text>
            </HStack>
          </VStack>

          <Button
            colorScheme="blue"
            ml={6}
            px={8}
            py={4}
            fontSize="md"
            fontWeight="semibold"
          >
            Confirm and Pay
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}
