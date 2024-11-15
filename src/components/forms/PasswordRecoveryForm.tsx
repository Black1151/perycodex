"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Button, useTheme, VStack } from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import { InputField } from "./InputField";
import { emailValidation } from "./validationSchema/validationSchema";

export type SignUpFormInputs = {
  email: string;
};

interface PasswordRecoveryFormProps {
  onSubmit: SubmitHandler<SignUpFormInputs>;
  isSubmitting: boolean;
}

export function PasswordRecoveryForm({
  onSubmit,
  isSubmitting,
}: PasswordRecoveryFormProps) {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignUpFormInputs>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ width: "100%", maxWidth: "md" }}
    >
      <VStack spacing={4} w="100%">
        <VStack gap="70px" w={300}>
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
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Request Password Reset
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
