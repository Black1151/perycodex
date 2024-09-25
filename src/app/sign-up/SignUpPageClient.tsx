"use client";

import { useDisclosure } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { SignUpForm, SignUpFormInputs } from "@/components/forms/SignUpForm";
import { useRouter } from "next/navigation";
import { SignUpSuccessModal } from "./SignUpSuccessModal";
import { useFetchClient } from "@/hooks/useFetchClient"; // Import the custom hook

export const SignUpPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient(); // Use the custom hook

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const result = await fetchClient("/api/auth/sign-up", {
      method: "POST",
      body: data,
      errorMessage: "Account creation failed.",
    });

    if (result) {
      onOpen();
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/login"); // Redirect to login after closing the modal
  };

  return (
    <>
      <SignUpForm onSubmit={onSubmit} isSubmitting={loading} errors={{}} />
      <SignUpSuccessModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
