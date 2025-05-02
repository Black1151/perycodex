"use client";

import React from "react";
import { Image } from "@chakra-ui/react";

export const Fun = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
        <Image src="/images/marketing/img.png" alt="Fun image" maxW="100%" />
  );
};

export default Fun;
