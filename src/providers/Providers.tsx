"use client";
import { useEffect } from "react";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { UnreadProvider } from "@/components/contexts/UnreadRecognitionContext";
import { ChakraThemeProvider } from "./ChakraThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "light");
  }, []);

  return (
    <NextAuthProvider>
      <ChakraThemeProvider>
        <UnreadProvider>{children}</UnreadProvider>
      </ChakraThemeProvider>
    </NextAuthProvider>
  );
}
