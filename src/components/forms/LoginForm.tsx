"use client";

import {SubmitHandler, useForm} from "react-hook-form";
import {
    Box,
    Button,
    Flex,
    HStack,
    Text,
    useTheme, useToast,
    VStack,
} from "@chakra-ui/react"
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import {InputField} from "./InputField";
import {useRouter, useSearchParams} from "next/navigation";
import {emailValidation} from "./validationSchema/validationSchema";
import {useFetchClient} from "@/hooks/useFetchClient";
import {useEffect, useState} from "react";
import {useCookies} from 'next-client-cookies';
import {useSession, signIn, signOut} from 'next-auth/react';
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

        const searchParams = new URLSearchParams(window.location.search);
        const isMissingToken = searchParams.get('MissingAuthToken');
        if (isMissingToken !== null) {
            if (isMissingToken == 'true') {
                try {
                    await signOut({callbackUrl: '/login'});
                } catch (error) {
                    // continue;
                }
            }
        } else {
            let NextAuthSession = await getSession();
            if (NextAuthSession !== undefined) {
                if (NextAuthSession !== null) {
                    if (NextAuthSession.user?.email != undefined) {

                        const result: { redirectUrl: string } | null = await fetchClient(
                            endpoint, {
                                method: "POST",
                                body: {
                                    loginType: "sso",
                                    email: NextAuthSession.user.email,
                                    password: null,
                                    accessToken: NextAuthSession.accessToken,
                                    type: NextAuthSession.accountProvider == 'google' ? 2 : 1
                                },
                                suppressError: true
                            });

                        if (result) {
                            router.push('/');
                        } else {
                            const res = NextResponse.json({success: false});
                            res.cookies.delete('next-auth.callback-url');
                            res.cookies.delete('next-auth.csrf-token');
                            res.cookies.delete('next-auth.session-token');
                            res.cookies.delete('__Host-next-auth.csrf-token');
                            res.cookies.delete('__Secure-next-auth.callback-url');
                            res.cookies.delete('__Secure-next-auth.session-token');

                            try {
                                await signOut({redirect: false});
                            } catch (error) {
                                // continue;
                            }
                        }

                    }
                }
            }
        }
    }

    return (

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                style={{width: "100%", maxWidth: "sm"}}
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
                                pt="10px"
                                fontSize="12px"
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
                        <HStack>
                            <Text pt="10px" fontSize="12px" color="gray">
                                Don&apos;t have an account?
                            </Text>
                            <Text
                                pt="10px"
                                fontSize="12px"
                                cursor="pointer"
                                color={theme.colors.perygonPink}
                                _hover={{cursor: "pointer"}}
                                onClick={() => router.push("sign-up")}
                            >
                                 Sign Up
                            </Text>
                        </HStack>
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
                            px={12}
                            height={12}
                            isLoading={loading}
                            color="lightGray"
                            backgroundColor="white"
                            justifyContent="left"
                            border="1px solid lightGray"
                            background="white url('https://perygonblob.blob.core.windows.net/public/Microsoft.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D') 15px 12px"
                            backgroundRepeat="no-repeat"
                            _hover={{color: "white", backgroundColor: "lightGray"}}
                            onClick={() => handleButtonClick('microsoft')}
                        >
                            Continue with Microsoft
                        </Button>
                        <Button
                            bgColor="none"
                            w="full"
                            px={12}
                            height={12}
                            isLoading={loading}
                            color="lightGray"
                            backgroundColor="white"
                            justifyContent="left"
                            border="1px solid lightGray"
                            background="white url('https://perygonblob.blob.core.windows.net/public/google.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D') 15px 12px"
                            backgroundRepeat="no-repeat"
                            _hover={{color: "white", backgroundColor: "lightGray"}}
                            onClick={() => handleButtonClick('google')}
                        >
                            Continue with Google
                        </Button>

                    </VStack>
                    <VStack spacing={4} w="100%" top={6} position="relative">
                        <Text pt="10px" fontSize="12px" color="gray">
                            Copyright &copy; 2024 Sedulo Limited (v1.0.1)
                        </Text>
                    </VStack>
                </VStack>
            </form>
    );
}

