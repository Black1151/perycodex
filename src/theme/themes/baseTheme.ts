// baseTheme.ts
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import { scrollBarThemes } from "@/theme/scrollBarThemes";
import { agChartStyles } from "@/theme/agChartStyles";
import { agGridStyles } from "../agGridStyles";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const baseTheme = extendTheme({
  config,

  colors: {
    primary: "blue",
    secondary: "#fff",
    elementBG: "white",

    primaryButton: "#fff",
    // perygonBlueTransparent: "rgba(13, 0, 61, 0.85)",
    seduloRed: "#B4213D",
    yellow: "#EFC718",
    lightGreen: "#92C01F",
    seduloGreen: "#008000",
    darkGray: "#4A4A4A",

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

  fringeCases: {
    recognitionCard: {
      elementBG: "elementBG",
      textColor: "primaryTextColor",
      secondaryTextColor: "themeTextColor",
    },
  },

  fonts: {
    heading: "Metropolis, sans-serif",
    body: "Metropolis, sans-serif",
    metropolis: "Metropolis, sans-serif",
    bonfire: "Bonfire, sans-serif",
  },

  styles: {
    global: (_props: { colorMode: "light" | "dark" }) => ({
      ...agGridStyles,
      ...scrollBarThemes,
      ...agChartStyles,
      "html, body": {
        backgroundColor: "#ffffff",
        color: "#000000",
      },
    }),
  },

  components: {
    Button: {
      variants: {
        primary: {
          mt: 5,
          w: "full",
          height: 12,
          backgroundColor: "primary",
          color: "white",
          _hover: {
            color: "primary",
            border: "1px solid",
            borderColor: "primary",
            backgroundColor: "white",
          },
          _disabled: {
            backgroundColor: "white",
            color: "primary",
            cursor: "not-allowed",
            opacity: 0.6,
          },
        },

        agPrimary: {
          bg: "transparent",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          _hover: {
            color: "primary",
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

        agPrimaryLight: {
          bg: "transparent",
          color: "primary",
          border: "1px solid var(--chakra-colors-primary)",
          _hover: {
            color: "white",
            bg: "primary",
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
    primaryGradient: "linear(to-br, secondary 60%, primary 100%)",
    secondaryGradient: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`,
    secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.3), rgba(255, 192, 203, 0.3))`,
  },

  // shadows: {
  //   primaryShadow: "0 0 10px 2px var(--chakra-colors-primary)",
  // },
});
