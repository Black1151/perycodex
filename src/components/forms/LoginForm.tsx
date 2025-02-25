"use client";

import {SubmitHandler, useForm} from "react-hook-form";
import {
    Box,
    Button,
    Flex,
    HStack,
    Text, useBreakpointValue,
    useTheme,
    VStack,
} from "@chakra-ui/react"
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import {InputField} from "./InputField";
import {useRouter, useSearchParams} from "next/navigation";
import {emailValidation} from "./validationSchema/validationSchema";
import {useFetchClient} from "@/hooks/useFetchClient";
import {useEffect, useState} from "react";
import {useSession, signIn, signOut} from 'next-auth/react';
import {getSession} from 'next-auth/react';
import Link from "next/link";

import {NextResponse} from "next/server";
import LoginFormButtons from "@/components/forms/LoginFormButtons";
import {DefaultSession} from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            sub?: string;
        } & DefaultSession["user"];
    }
}

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
    type ButtonId = 'email' | 'microsoft' | 'google' | 'apple';
    const showText = useBreakpointValue({base: false, md: true});
    const {data: session, status} = useSession();
    const linkAppleAccountSub = searchParams.get('linkAppleAccountSub') ?? '';
    const appleAccountLinked = searchParams.get('appleAccountLinked');

    useEffect(() => {
        handleSsoSignIn();
        router.refresh();
    }, []);

    const {fetchClient, loading} = useFetchClient();
    const {
        register,
        handleSubmit,
        formState: {errors: formErrors},
    } = useForm<LoginFormInputs>();

    const handleButtonClick = (buttonId: ButtonId) => {

        const callbackUrl = secureLink ? `/login?l=${secureLink}` : '/login';

        switch (buttonId) {
            case 'email':
                handleSubmit(handleFormSubmit)();
                break;
            case 'microsoft':
                signIn('azure-ad', {callbackUrl: callbackUrl});
                break;
            case 'google':
                signIn('google', {callbackUrl: callbackUrl});
                break;
            case 'apple':
                signIn('apple', {callbackUrl: callbackUrl});
                break;
            default:
            // Handle default or error case
        }
    };

    const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const searchParams = new URLSearchParams(window.location.search);
        const endpoint = secureLink
            ? `/api/auth/sign-in?l=${secureLink}`
            : "/api/auth/sign-in";

        const linkAppleAccountSub = searchParams.get('linkAppleAccountSub');
        if (linkAppleAccountSub == null) {
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
        } else {
            const appleLinkingResult: { redirectUrl: string, resource?: { sub?: string } } | null = await fetchClient(
                'authentication/linkAppleLogin', {
                    method: "POST",
                    body: {
                        ...data,
                        loginType: 'email',
                        sub: linkAppleAccountSub
                    },
                    suppressError: true
                });
            if (appleLinkingResult) {
                router.push(`/login?appleAccountLinked=${data.email}`);
            }
        }
    };

    const handleSsoSignIn = async () => {
        const endpoint = secureLink
            ? `/api/auth/sign-in?l=${secureLink}`
            : "/api/auth/sign-in";

        const searchParams = new URLSearchParams(window.location.search);
        const isMissingToken = searchParams.get('MissingAuthToken');
        if (isMissingToken !== null) {
            if (isMissingToken == 'true') {
                try {
                    await signOut({redirect: false});
                } catch (error) {
                    // continue;
                }
            }
        } else {
            let NextAuthSession = await getSession();
            if (NextAuthSession !== undefined) {
                if (NextAuthSession !== null) {

                    const loginType = () => {
                        switch(NextAuthSession.accountProvider) {
                            case 'azure-ad': return 1;
                            case 'google': return 2;
                            case 'apple': return 3;
                        }
                    }

                    console.log(NextAuthSession);

                    if (NextAuthSession.user?.email === undefined) {
                        if (NextAuthSession.accountProvider != undefined) {
                            console.log('----NEXT AUTH SESSION----');
                            console.log(NextAuthSession);
                            const result: { redirectUrl: string, resource?: { sub?: string } } | null = await fetchClient(
                                endpoint, {
                                    method: "POST",
                                    body: {
                                        loginType: "sso",
                                        sub: NextAuthSession.accountProvider,
                                        password: null,
                                        accessToken: NextAuthSession.accessToken,
                                        type: loginType()
                                    },
                                    suppressError: true
                                });

                            if (result) {
                                if (result.resource) {
                                    if (result.resource?.sub != undefined) {
                                        router.push(`/login/?linkAppleAccountSub=${result.resource?.sub}`);
                                    } else {
                                        router.push(result.redirectUrl);
                                    }
                                }
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
                    } else {
                        const result: { redirectUrl: string } | null = await fetchClient(
                            endpoint, {
                                method: "POST",
                                body: {
                                    loginType: "sso",
                                    email: NextAuthSession.user.email,
                                    sub: NextAuthSession.user.sub ?? null,
                                    password: null,
                                    accessToken: NextAuthSession.accessToken,
                                    type: loginType()
                                },
                                suppressError: true
                            });

                        if (result) {
                            router.push(result.redirectUrl);
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
            <VStack spacing={0} w="100%">
                {appleAccountLinked != null && (
                    <VStack spacing={0} w={300} gap={2}>
                        <Text pt="10px" fontSize={["16px", "12px"]} color="gray">
                            Your Apple account is now linked to following Perygon user:
                        </Text>
                        <Text pt="10px" fontSize={["16px", "12px"]} color="gray">
                            {appleAccountLinked}
                        </Text>
                    </VStack>
                )}
                {appleAccountLinked == null && (
                <VStack spacing={0} w={300} gap={2}>

                    {(linkAppleAccountSub != '' &&
                        <Text pt="10px" fontSize={["16px", "12px"]} color="gray">
                            Your Apple account couldn&apos;t be linked to existing Perygon user.
                        </Text>
                    )}
                    {(linkAppleAccountSub != '' &&
                        <Text pt="10px" fontSize={["16px", "12px"]} color="gray">
                            Please log in with Perygon username and password below in order to permanently assign this
                            Apple account with your Perygon account
                        </Text>
                    )}
                    {(linkAppleAccountSub != '' &&
                        <input
                            type="hidden"
                            name="linkAppleAccountSub"
                            value={linkAppleAccountSub}
                        />
                    )}
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
                            fontSize={["16px", "12px"]}
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
                        <Text pt="10px" fontSize={["16px", "12px"]} color="gray">
                            Don&apos;t have an account?
                        </Text>
                        <Text
                            pt="10px"
                            fontSize={["16px", "12px"]}
                            cursor="pointer"
                            color={theme.colors.perygonPink}
                            _hover={{cursor: "pointer"}}
                            onClick={() => router.push("sign-up")}
                        >
                            Sign Up
                        </Text>
                    </HStack>
                    <LoginFormButtons loading={loading} handleButtonClick={handleButtonClick}
                                      linkAppleAccountSub={linkAppleAccountSub ?? ''}/>

                </VStack>
                    )}
                <Flex gap={4} w={"100%"} top={6} position="relative" justify={'space-between'} align={'center'}>
                    <Text p="0" pt="10px" fontSize={["10px", "12px"]} color="gray">
                        Copyright &copy; 2024 Sedulo Limited (v1.1.3)
                    </Text>
                    <Link href={'/privacy-policy'}>
                        <Text p="0" pt="10px" fontSize={["10px", "12px"]} color="gray">
                            Privacy Policy
                        </Text>
                    </Link>
                </Flex>
            </VStack>
        </form>
    );
}

