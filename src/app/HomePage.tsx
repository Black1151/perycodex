"use client";

import { Button, useTheme, VStack } from "@chakra-ui/react";
import { Header } from "./Header";
import { SplashScreen } from "@/components/SplashScreen/SplashScreen";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const onClickLogout = async () => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
    });
    router.push("/login");
  };

  return (
    <VStack
      minH="100vh"
      width="100%"
      overflowX="hidden"
      flex={1}
      bgGradient={`linear(to-br, ${theme.colors.seduloRed}, ${theme.colors.perygonPink})`}
    >
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          <Header />
          <Button onClick={onClickLogout}>LOG OUT</Button>
        </>
      )}
    </VStack>
  );
}
