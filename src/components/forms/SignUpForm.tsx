"use client";

import {FieldError, SubmitHandler, useForm} from "react-hook-form";
import {Button, Flex, Text, useTheme, VStack} from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import {InputField} from "./InputField";
import {emailValidation} from "./validationSchema/validationSchema";
import {useRouter, useSearchParams} from "next/navigation";

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

export function SignUpForm({onSubmit, isSubmitting}: SignUpFormProps) {
    const theme = useTheme();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors: formErrors},
    } = useForm<SignUpFormInputs>();

    const handleFormSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
        onSubmit(data);
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            style={{width: "100%", maxWidth: "sm"}}
        >
            <VStack spacing={0} w="100%">
                <VStack spacing={0} w={300} gap={2}>
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
                    <Flex w="100%" justifyContent="flex-end" pb={[0, 0]}>
                        <Text
                            fontSize={["16px", "12px"]}
                            cursor="pointer"
                            color={theme.colors.perygonPink}
                            _hover={{cursor: "pointer"}}
                            onClick={() => router.push("/login")}
                        >
                            &laquo; Go back to login
                        </Text>
                    </Flex>
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
