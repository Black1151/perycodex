"use client";

import { useDisclosure } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { SignUpForm, SignUpFormInputs } from "@/components/forms/SignUpForm";
import { useRouter } from "next/navigation";
import { SignUpSuccessModal } from "./SignUpSuccessModal";
import { useFetchClient } from "@/hooks/useFetchClient";

export const SignUpPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const result = await fetchClient("/api/auth/sign-up", {
      method: "POST",
      body: data,
      errorMessage: "Email already in use",
      redirectOnError: false,
    });

    if (result) {
      onOpen();
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/login");
  };

  return (
    <>
      <SignUpForm onSubmit={onSubmit} isSubmitting={loading} errors={{}} />
      <SignUpSuccessModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
