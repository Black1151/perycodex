"use client";

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Button, Flex, Text, useTheme, VStack, HStack } from "@chakra-ui/react";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import { InputField } from "./InputField";
import { emailValidation } from "./validationSchema/validationSchema";
import { useRouter } from "next/navigation";

export type SignUpFormInputs = {
  email: string;
};

interface SignUpFormProps {
  onSubmit: SubmitHandler<SignUpFormInputs>;
  isSubmitting: boolean;
  errors: {
    email?: FieldError;
  };
}

export function CompanySignUpForm({ onSubmit, isSubmitting }: SignUpFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignUpFormInputs>();

  const handleFormSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    onSubmit(data);
  };

  // Switch back to individual sign-up by updating URL search params
  const handleSwitch = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("signUpType", "individual");
    router.push(`/sign-up?${searchParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "sm" }}
    >
      <VStack spacing={0} w="100%">
        <VStack w="full" h="100%">
          <HStack>
            <HStack
              color={theme.colors.primaryTextColor}
              _groupHover={{ color: "white" }}
              transition="color 0.2s ease"
            >
              <BusinessIcon style={{ marginRight: "4px" }} />
            </HStack>
            <Text
              fontWeight={600}
              fontSize={20}
              color={theme.colors.primaryTextColor}
              _groupHover={{ color: "white" }}
              transition="color 0.2s ease"
            >
              Create a new company
            </Text>
          </HStack>
          <Text
            fontSize={14}
            color={theme.colors.secondaryTextColor}
            _groupHover={{ color: "white" }}
            transition="color 0.2s ease"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            aliquet tempor metus, a volutpat metus facilisis hendrerit. Maecenas
            non est libero. Mauris sed tortor sed augue semper pulvinar.
          </Text>
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
            focusBorderColor={theme.colors.primary}
          />

          <Flex w="100%" justifyContent="space-between">
            <Text
              fontSize={["16px", "12px"]}
              cursor="pointer"
              color={theme.colors.primary}
              _hover={{ cursor: "pointer" }}
              onClick={handleSwitch}
            >
              Switch to individual sign up
            </Text>
            <Text
              fontSize={["16px", "12px"]}
              cursor="pointer"
              color={theme.colors.primary}
              _hover={{ cursor: "pointer" }}
              onClick={() => router.push("/login")}
            >
              &laquo; Go back to login
            </Text>
          </Flex>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            w="100%"
          >
            Sign Up
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
