"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button, VStack, Text, useTheme, Flex, Box } from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import { HorizontalRule } from "@mui/icons-material";

export type LoginFormInputs = {
  username: string;
  password: string;
};

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormInputs>;
  isSubmitting: boolean;
  errors: {
    username?: {
      message: string;
    };
    password?: {
      message: string;
    };
  };
}

export function LoginForm({ onSubmit, isSubmitting, errors }: LoginFormProps) {
  const theme = useTheme();
  const { register, handleSubmit, watch } = useForm<LoginFormInputs>();

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    onSubmit(data);
  };

  const formValues = watch();
  console.log("Current Form Values:", formValues);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "md" }}
    >
      <VStack spacing={4} w={500} p={6}>
        <VStack spacing={4} w={300}>
          <InputField
            name="username"
            placeholder="Email"
            type="text"
            error={errors.username}
            icon={
              <EmailIcon style={{ color: errors.username ? "red" : "gray" }} />
            }
            register={register("username", { required: "Email is required" })}
            focusBorderColor={theme.colors.perygonPink}
          />
          <InputField
            name="password"
            placeholder="Password"
            type="password"
            error={errors.password}
            icon={
              <LockIcon style={{ color: errors.password ? "red" : "gray" }} />
            }
            register={register("password", {
              required: "Password is required",
            })}
            focusBorderColor={theme.colors.perygonPink}
          />
          {errors.password && (
            <Text fontSize="sm" color="red.500">
              {errors.password.message}
            </Text>
          )}
          <Flex w="100%" justifyContent="flex-end">
            <Text
              fontSize="sm"
              cursor="pointer"
              color={theme.colors.perygonPink}
            >
              Forgot password?
            </Text>
          </Flex>
          <Button
            backgroundColor={theme.colors.perygonPink}
            type="submit"
            w="full"
            isLoading={isSubmitting}
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
        <Box borderBottom="1px solid lightGray" width="100%" />
        <VStack w={300}>
          <Button
            bgColor="none"
            w="full"
            isLoading={isSubmitting}
            color="lightGray"
            backgroundColor="white"
            border="1px solid lightGray"
            _hover={{ color: "white", backgroundColor: "lightGray" }}
          >
            Sign-up
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
