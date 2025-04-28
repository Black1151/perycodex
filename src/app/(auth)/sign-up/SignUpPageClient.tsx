"use client";

import { useDisclosure, VStack } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import {
  SignUpForm as IndividualSignUpForm,
  SignUpFormInputs,
} from "@/components/forms/SignUpForm";
import { CompanySignUpForm } from "@/components/forms/CompanySignUpForm";
import { useRouter } from "next/navigation";
import { SignUpSuccessModal } from "./SignUpSuccessModal";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SignUpTypeSelector } from "./SignUpTypeSelector";
import { useState } from "react";

export const SignUpPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient();
  const [signUpType, setSignUpType] = useState<"company" | "individual">(
    "individual"
  );

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const endpoint =
      signUpType === "company"
        ? "/api/auth/company-sign-up"
        : "/api/auth/sign-up";

    const result = await fetchClient(endpoint, {
      method: "POST",
      body: data,
      errorMessage:
        signUpType === "company"
          ? "Admin email already in use"
          : "Email already in use",
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
    <VStack
      spacing={0}
      w="100%"
      h="100%"
      align="stretch"
      justify="space-between"
    >
      {/* 1. Type toggle */}
      <SignUpTypeSelector
        signUpType={signUpType}
        setSignUpType={setSignUpType}
      />

      {/* 2. Conditionally render the right form */}
      {signUpType === "individual" ? (
        <IndividualSignUpForm
          onSubmit={onSubmit}
          isSubmitting={loading}
          errors={{}}
        />
      ) : (
        <CompanySignUpForm
          onSubmit={onSubmit}
          isSubmitting={loading}
          errors={{}}
        />
      )}

      {/* 3. Success modal (shared) */}
      <SignUpSuccessModal isOpen={isOpen} onClose={handleClose} />
    </VStack>
  );
};
