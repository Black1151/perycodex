"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  VStack,
  Text,
  useTheme,
  Flex,
  Box,
  HStack,
} from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import { useRouter } from "next/navigation";
import { PerygonModal } from "../modals/PerygonModal";
import { emailValidation } from "./validationSchema/validationSchema";
import { useFetchClient } from "@/hooks/useFetchClient";

export type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const theme = useTheme();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormInputs>();

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const result = await fetchClient("/api/auth/sign-in", {
      method: "POST",
      body: data,
      successMessage: "Successfully logged in!",
      errorMessage: "Incorrect user or password",
      redirectOnError: false,
    });

    if (result) {
      router.push("/");
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
            name="email"
            placeholder="Email"
            type="text"
            error={formErrors.email}
            icon={
              <EmailIcon
                style={{
                  width: "20px",
                  color: formErrors.email ? "red" : "lightGray",
                }}
              />
            }
            register={() => register("email", emailValidation)}
            focusBorderColor={theme.colors.perygonPink}
          />
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
          <Flex w="100%" justifyContent="flex-end">
            <Text
              fontSize="2xs"
              cursor="pointer"
              color={theme.colors.perygonPink}
              _hover={{ cursor: "pointer" }}
              onClick={() => router.push("/password-recovery")}
            >
              Forgot password?
            </Text>
          </Flex>
          <Button
            mt={5}
            backgroundColor={theme.colors.perygonPink}
            type="submit"
            w="full"
            isLoading={loading}
            height={12}
            color="white"
            _hover={{
              color: theme.colors.perygonPink,
              border: `1px solid ${theme.colors.perygonPink}`,
              backgroundColor: "white",
            }}
          >
            Login
          </Button>
        </VStack>
        <HStack>
          <Box borderBottom="1px solid lightGray" width="100px" />
          <Text color="lightGray" fontSize="xs">
            OR
          </Text>
          <Box borderBottom="1px solid lightGray" width="100px" />
        </HStack>
        <VStack w={300}>
          <Button
            bgColor="none"
            w="full"
            height={12}
            isLoading={loading}
            color="lightGray"
            backgroundColor="white"
            border="1px solid lightGray"
            _hover={{ color: "white", backgroundColor: "lightGray" }}
            onClick={() => router.push("sign-up")}
          >
            Sign-up
          </Button>
        </VStack>
        <PerygonModal
          title={"Account activation successful"}
          body={"Please login to complete your account set up process"}
          isOpen={false}
          onClose={() => {}}
        />
        <Text pt="10px" fontSize="12px" color="gray">
          Copyright &copy; 2024 Sedulo Limited (v0.2)
        </Text>
      </VStack>
    </form>
  );
}
