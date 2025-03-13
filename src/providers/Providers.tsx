"use client";

import { perygonTheme } from "@/theme/themes/perygon/perygonTheme/perygonTheme";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { UnreadProvider } from "@/components/contexts/UnreadRecognitionContext";
import { perygonThemeDark } from "@/theme/themes/perygon/perygonThemeDark/perygonThemeDark";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "light");
  }, []);

  return (
    <NextAuthProvider>
      <ChakraProvider theme={perygonThemeDark}>
        <UnreadProvider>{children}</UnreadProvider>
      </ChakraProvider>
    </NextAuthProvider>
  );
}
