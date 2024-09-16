import { extendTheme } from "@chakra-ui/react";

export const perygonTheme = extendTheme({
  colors: {
    perygonPink: "#ff0070",
    seduloRed: "#B4213D",
    yellow: "#EFC718",
    lightGreen: "#92C01F",
  },
  fonts: {
    heading: "Metropolis, sans-serif",
    body: "Metropolis, sans-serif",
    bonfire: "Bonfire, sans-serif",
  },
  components: {
    Button: {
      variants: {
        primary: {
          mt: 5,
          backgroundColor: "perygonPink",
          w: "full",
          height: 12,
          color: "white",
          _hover: {
            color: "perygonPink",
            border: "1px solid",
            borderColor: "perygonPink",
            backgroundColor: "white",
          },
        },
      },
    },
  },
});
