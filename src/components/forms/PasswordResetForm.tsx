"use client";

import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import {
  Button,
  VStack,
  useTheme,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import { useRouter } from "next/navigation";
import { passwordValidation } from "./validationSchema/validationSchema";

export type ActivateAccountFormInputs = {
  password: string;
  repeatPassword: string;
};

interface ActivateAccountFormProps {
  token: string;
  errors: {
    password?: FieldError;
    repeatPassword?: FieldError;
  };
}

export function PasswordResetForm({ token, errors }: ActivateAccountFormProps) {
  const theme = useTheme();
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<ActivateAccountFormInputs>();

  const handleFormSubmit: SubmitHandler<ActivateAccountFormInputs> = async (
    data
  ) => {
    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "An unexpected error occurred.");
      }

      onOpen();
    } catch (error: any) {
      toast({
        title: "There was an error updating the password",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{ width: "100%", maxWidth: "md" }}
      >
        <VStack spacing={4} w={500} p={6}>
          <VStack spacing={0} w={300}>
            <InputField
              name="password"
              placeholder="Password"
              type="password"
              error={formErrors.password}
              icon={
                <LockIcon
                  style={{
                    width: "20px",
                    color: formErrors.password ? "red" : "lightGray",
                  }}
                />
              }
              register={() => register("password", passwordValidation)}
              focusBorderColor={theme.colors.perygonPink}
            />
            <InputField
              name="repeatPassword"
              placeholder="Repeat Password"
              type="password"
              error={formErrors.repeatPassword}
              icon={
                <LockIcon
                  style={{
                    width: "20px",
                    color: formErrors.repeatPassword ? "red" : "lightGray",
                  }}
                />
              }
              register={() =>
                register("repeatPassword", {
                  required: "Please repeat your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })
              }
              focusBorderColor={theme.colors.perygonPink}
            />
            <Button
              mt={0}
              backgroundColor={theme.colors.perygonPink}
              type="submit"
              w="full"
              height={12}
              color="white"
              _hover={{
                color: theme.colors.perygonPink,
                border: `1px solid ${theme.colors.perygonPink}`,
                backgroundColor: "white",
              }}
            >
              Update Password
            </Button>
          </VStack>
        </VStack>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={5}>
          <VStack gap={8}>
            <ModalHeader>Password updated successfully</ModalHeader>
            <ModalBody>
              Your password has been successfully updated. You can now log in
              with your new password.
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={() => router.push("/login")}>
                To Login
              </Button>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
}
