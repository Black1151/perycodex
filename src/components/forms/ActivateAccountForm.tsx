"use client";

import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { Button, VStack, useTheme, useToast } from "@chakra-ui/react";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import axios from "axios";
import { useRouter } from "next/navigation";

export type ActivateAccountFormInputs = {
  password: string;
  repeatPassword: string;
};

interface ActivateAccountFormProps {
  token: string;
  isSubmitting: boolean;
  errors: {
    password?: FieldError;
    repeatPassword?: FieldError;
  };
}

export function ActivateAccountForm({
  token,
  isSubmitting,
}: ActivateAccountFormProps) {
  const theme = useTheme();
  const toast = useToast();
  const router = useRouter();

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
      await axios.post("/api/auth/activate-account", {
        token,
        password: data.password,
      });

      toast({
        title: "Account Activated",
        description: "Your account has been successfully activated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";

      toast({
        title: "There was an error activating your account!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
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
            register={() =>
              register("password", {
                required: "Password is required",
              })
            }
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
            mt="60px"
            backgroundColor={theme.colors.perygonPink}
            type="submit"
            w="full"
            isLoading={isSubmitting}
            height={12}
            color="white"
            _hover={{
              color: theme.colors.perygonPink,
              border: `1px solid ${theme.colors.perygonPink}`,
              backgroundColor: "white",
            }}
          >
            Activate Account
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
