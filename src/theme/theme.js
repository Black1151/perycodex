import { extendTheme } from "@chakra-ui/react";
import { agGridStyles } from "./agGridStyles";
import { scrollBarThemes } from "@/theme/scrollBarThemes";

export const perygonTheme = extendTheme({
  colors: {
    perygonPink: "#ff0070",
    seduloRed: "#B4213D",
    yellow: "#EFC718",
    lightGreen: "#92C01F",
    seduloGreen: "#008000",
    happinessScale: {
      1: "#b22200",
      2: "#e92300",
      3: "#e74e1c",
      4: "#e74e1c",
      5: "#f8b133",
      6: "#fbd238",
      7: "#aeea92",
      8: "#83e05c",
      9: "#00bf00",
      10: "#00bf00",
    },
  },
  fonts: {
    heading: "Metropolis, sans-serif",
    body: "Metropolis, sans-serif",
    bonfire: "Bonfire, sans-serif",
  },
  styles: {
    global: {
      ...agGridStyles,
      ...scrollBarThemes,
    },
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
            _disabled: {
              color: "white",
              border: "none",
              backgroundColor: "perygonPink",
            },
          },
        },
        agPrimary: {
          bg: "transparent",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          _hover: {
            color: "perygonPink",
            bg: "white",
            boxShadow: "md",
            _disabled: {
              color: "white",
              bg: "transparent",
              boxShadow: "none",
            },
          },
          _focus: {
            boxShadow: "outline",
          },
        },
        darkGray: {
          bgColor: "darkGray",
          border: "1px solid",
          borderColor: "darkGray",
          color: "white",
          _hover: {
            color: "darkGray",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              backgroundColor: "darkGray",
            },
          },
        },
        green: {
          bgColor: "seduloGreen",
          border: "1px solid",
          borderColor: "seduloGreen",
          color: "white",
          _hover: {
            color: "green",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              backgroundColor: "seduloGreen",
            },
          },
        },
        red: {
          bgColor: "seduloRed",
          border: "1px solid",
          borderColor: "seduloRed",
          color: "white",
          _hover: {
            color: "seduloRed",
            backgroundColor: "white",
            _disabled: {
              color: "white",
              backgroundColor: "seduloRed",
            },
          },
        },
      },
    },
    Switch: {
      variants: {
        primary: {
          track: {
            _checked: {
              bg: "lightGreen",
            },
            bg: "#ccc",
          },
          thumb: {
            bg: "white",
          },
        },
      },
    },
  },
  gradients: {
    perygonBackground: "linear(to-br, seduloRed 60%, perygonPink 100%)",
  },
});
