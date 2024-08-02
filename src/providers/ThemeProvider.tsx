"use client";

import { perygonTheme } from "@/theme/theme";
import { ChakraProvider } from "@chakra-ui/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={perygonTheme}>{children}</ChakraProvider>;
}
