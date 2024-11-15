"use client";

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Button, useTheme, VStack } from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import { InputField } from "./InputField";
import { emailValidation } from "./validationSchema/validationSchema";

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

export function SignUpForm({ onSubmit, isSubmitting }: SignUpFormProps) {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignUpFormInputs>();

  const handleFormSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "md" }}
    >
      <VStack spacing={4} w="100%">
        <VStack w={300}>
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
          <Button
            type="submit"
            variant="primary"
            mt="90px"
            isLoading={isSubmitting}
          >
            Sign Up
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
