"use client";

import { perygonTheme } from "@/theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import NextAuthProvider from "@/providers/NextAuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // fix apple iOS zooming on focusout
  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "light");
    // TODO: Investigate as this ruins the whole layout
    // document.body.style.transform = "scale(1)";
    // document.body.style.transformOrigin = "0 0";
    // if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    //   document.body.style.transform = "scale(1)";
    //   document.body.style.transformOrigin = "0 0";
    // }
  }, []);

  return <NextAuthProvider><ChakraProvider theme={perygonTheme}>{children}</ChakraProvider></NextAuthProvider>;
}
