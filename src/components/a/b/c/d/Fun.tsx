"use client";

import { PerygonModal } from "@/components/modals/PerygonModal";
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
    <PerygonModal
      isOpen={isOpen}
      onClose={onClose}
      title="One last fun surprise from Oliver!"
      body={
        <Image src="/images/marketing/img.png" alt="Fun image" maxW="100%" />
      }
    />
  );
};

export default Fun;
