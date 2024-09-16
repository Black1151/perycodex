// PasswordRecoveryPageClient.tsx

"use client";

import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { PasswordRecoveryForm } from "@/components/forms/PasswordRecoveryForm";
import { PasswordRecoveryModal } from "./PasswordRecoveryModal";
import { SignUpFormInputs } from "@/components/forms/SignUpForm";

export const PasswordRecoveryPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: SignUpFormInputs) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/password-recovery", data);
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
