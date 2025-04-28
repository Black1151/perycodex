"use client";

import { Spinner, useDisclosure, VStack } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import {
  SignUpForm as IndividualSignUpForm,
  SignUpFormInputs,
} from "@/components/forms/SignUpForm";
import { CompanySignUpForm } from "@/components/forms/CompanySignUpForm";
import { useRouter, useSearchParams } from "next/navigation";
import { SignUpSuccessModal } from "./SignUpSuccessModal";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SignUpTypeSelector } from "./SignUpTypeSelector";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const SignUpPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient();

  const searchParams = useSearchParams();
  const initialType = searchParams.get("signUpType");

  const [signUpType, setSignUpType] = useState<
    "company" | "individual" | null
  >(initialType === "company" || initialType === "individual"
    ? (initialType as "company" | "individual")
    : null
  );

  useEffect(() => {
    if (initialType === "company" || initialType === "individual") {
      setSignUpType(initialType as "company" | "individual");
    }
  }, [initialType]);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const endpoint =
      signUpType === "company"
        ? "/api/auth/company-sign-up" //TODO: Update this endpoint to the correct one once its ready
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
    <VStack spacing={0} w="100%" h="100%" align="stretch" justify="space-between">
      <AnimatePresence mode="wait">
        {signUpType === "individual" ? (
          <motion.div
            key="individual"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <IndividualSignUpForm
              onSubmit={onSubmit}
              isSubmitting={loading}
              errors={{}}
            />
          </motion.div>
        ) : signUpType === "company" ? (
          <motion.div
            key="company"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CompanySignUpForm
              onSubmit={onSubmit}
              isSubmitting={loading}
              errors={{}}
            />
          </motion.div>
        ) : loading ? (
          <motion.div
            key="company"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Spinner />
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SignUpTypeSelector signUpType={null} setSignUpType={setSignUpType} />
          </motion.div>
        )}
      </AnimatePresence>

      <SignUpSuccessModal isOpen={isOpen} onClose={handleClose} />
    </VStack>
  );
};
