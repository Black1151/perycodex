"use client";

import {SubmitHandler, useForm} from "react-hook-form";
import {
    Box,
    Button,
    Flex,
    HStack,
    Text,
    useTheme,
    VStack,
} from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import {InputField} from "./InputField";
import {useRouter, useSearchParams} from "next/navigation";
import {emailValidation} from "./validationSchema/validationSchema";
import {useFetchClient} from "@/hooks/useFetchClient";
import {useEffect, useState} from "react";
import {useCookies} from 'next-client-cookies';
import {useSession, signIn, signOut} from 'next-auth/react';
import {SessionProvider} from "next-auth/react";
import { getSession } from 'next-auth/react';

import apiClient from "@/lib/apiClient";
import {NextResponse} from "next/server";

export type LoginFormInputs = {
    email: string;
    password: string;
};

export function LoginForm() {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [clickedButton, setClickedButton] = useState<ButtonId | null>(null);
    const secureLink = searchParams.get("l");
    type ButtonId = 'email' | 'microsoft' | 'google';

    const {data: session, status} = useSession();

    useEffect(() => {
        handleMSOSignin();
        router.refresh();
    }, []);

    const {fetchClient, loading} = useFetchClient();
    const {
        register,
        handleSubmit,
        formState: {errors: formErrors},
    } = useForm<LoginFormInputs>();


    const handleButtonClick = (buttonId: ButtonId) => {
        switch (buttonId) {
            case 'email':
                handleSubmit(handleFormSubmit)();
                break;
            case 'microsoft':
                console.log('microsoft button click;');
                signIn('azure-ad',  {callbackUrl: '/'});
                break;
            case 'google':
                signIn('google',  {callbackUrl: '/'});
                break;
            default:
            // Handle default or error case
        }
    };

    const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const endpoint = secureLink
            ? `/api/auth/sign-in?l=${secureLink}`
            : "/api/auth/sign-in";

        const result: { redirectUrl: string } | null = await fetchClient(endpoint, {
            method: "POST",
            body: {...data, loginType: 'email'},
            successMessage: "Successfully logged in!",
            errorMessage: "Incorrect user or password",
            redirectOnError: false,
        });

        if (result) {
            router.push(result.redirectUrl);
        }
    };

    const handleMSOSignin = async () => {
        const endpoint = secureLink
            ? `/api/auth/sign-in?l=${secureLink}`
            : "/api/auth/sign-in";

        let NextsAuthSession = await getSession();
        console.log('###===|Session (From LoginForm handleMSOSignin)|===###');
        console.log(NextsAuthSession);


        if (NextsAuthSession !== undefined) {
            if (NextsAuthSession !== null) {
                if (NextsAuthSession.user?.email != undefined) {
                    const result: { redirectUrl: string } | null = await fetchClient(endpoint, {
                        method: "POST",
                        body: {
                            loginType: "sso",
                            email: NextsAuthSession.user.email,
                            password: null
                        },
                    });



                    if (result) {
                        router.push('/');
                    }

                }
            }
        }
        // else {
        //     signIn('azure-ad', {callbackUrl: '/login'});
        // }

    }

    return (
        <SessionProvider>
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                style={{width: "100%", maxWidth: "md"}}
            >
                <VStack spacing={4} w="100%">
                    <VStack spacing={0} w={300} gap={2} position="absolute" top="300px">
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
                                _hover={{cursor: "pointer"}}
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
                            onClick={() => handleButtonClick('email')}
                        >
                            Login with email
                        </Button>
                        <Button
                            bgColor="none"
                            w="full"
                            height={12}
                            isLoading={loading}
                            color="white"
                            backgroundColor="lightBlue"
                            border="1px solid lightBlue"
                            _hover={{color: "lightBlue", backgroundColor: "white", border: `1px solid lightBlue`}}
                            onClick={() => handleButtonClick('microsoft')}
                        >
                            Sign in with Microsoft
                        </Button>
                        <Button
                            bgColor="none"
                            w="full"
                            height={12}
                            isLoading={loading}
                            color="white"
                            backgroundColor="lightGray"
                            border="1px solid lightGray"
                            _hover={{color: "lightGray", backgroundColor: "white", border: `1px solid lightGray`}}
                            onClick={() => handleButtonClick('google')}
                        >
                            Sign in with Google
                        </Button>
                        <HStack>
                            <Box borderBottom="1px solid lightGray" width="100px"/>
                            <Text color="lightGray" fontSize="xs">
                                OR
                            </Text>
                            <Box borderBottom="1px solid lightGray" width="100px"/>
                        </HStack>
                        <Button
                            bgColor="none"
                            w="full"
                            height={12}
                            isLoading={loading}
                            color="lightGray"
                            backgroundColor="white"
                            border="1px solid lightGray"
                            _hover={{color: "white", backgroundColor: "lightGray"}}
                            onClick={() => router.push("sign-up")}
                        >
                            Sign-up
                        </Button>
                    </VStack>
                    <Text pt="10px" fontSize="12px" color="gray">
                        Copyright &copy; 2024 Sedulo Limited (v1.0.1)
                    </Text>
                </VStack>
            </form>
        </SessionProvider>
    );
}

