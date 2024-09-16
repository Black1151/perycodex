"use client";

import { useState } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { SubmitHandler } from "react-hook-form";
import { SignUpForm, SignUpFormInputs } from "@/components/forms/SignUpForm";

import { useRouter } from "next/navigation";
import { SignUpSuccessModal } from "./SignUpSuccessModal";

export const SignUpPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/sign-up", data);
      if (response.status === 200) {
        onOpen();
      }
    } catch (error: any) {
      toast({
        title: "Sorry, sign up failed!",
        description: error.response?.data?.error || "Account creation failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/login");
  };

  return (
    <>
      <SignUpForm onSubmit={onSubmit} isSubmitting={isSubmitting} errors={{}} />
      <SignUpSuccessModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
