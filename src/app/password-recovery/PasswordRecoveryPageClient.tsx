"use client";

import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { PasswordRecoveryForm } from "@/components/forms/PasswordRecoveryForm";
import { PasswordRecoveryModal } from "./PasswordRecoveryModal";
import { SignUpFormInputs } from "@/components/forms/SignUpForm";

export const PasswordRecoveryPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: SignUpFormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Password recovery request failed");
      }
      onOpen();
    } catch (error) {
      console.error("Password recovery request failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PasswordRecoveryForm
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
      <PasswordRecoveryModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
