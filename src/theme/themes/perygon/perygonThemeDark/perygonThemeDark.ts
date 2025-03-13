import { color, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { agGridStyles } from "../../../agGridStyles";
import { scrollBarThemes } from "@/theme/scrollBarThemes";
import { agChartStyles } from "@/theme/agChartStyles";
import { colorPalette } from "./colorPalette";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const perygonThemeDark = extendTheme({
  config,
  colors: {
    primary: colorPalette.perygonDark,
    secondary: colorPalette.perygonPurple,

    // buttons
    primaryButton: colorPalette.perygonPurple,

    //legacy colors to be removed during refactor
    perygonBlueTransparent: "rgba(13, 0, 61, 0.85)",
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
    metropolis: "Metropolis, sans-serif",
    bonfire: "Bonfire, sans-serif",
  },
  styles: {
    global: (props: { colorMode: "light" | "dark" }) => {
      return {
        ...agGridStyles,
        ...scrollBarThemes,
        ...agChartStyles,
        "html, body": {
          backgroundColor: "#ffffff",
          color: "#000000",
        },
      };
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          mt: 5,
          backgroundColor: colorPalette.perygonPurple,
          w: "full",
          height: 12,
          color: "white",
          border: "1px solid",
          borderColor: "white",
          _hover: {
            color: colorPalette.perygonPurple,
            border: "1px solid",
            // borderColor: colorPalette.perygonPurple,
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
        agPrimaryLight: {
          bg: "transparent",
          color: "perygonPink",
          border: "1px solid var(--chakra-colors-perygonPink)",
          _hover: {
            color: "white",
            bg: "perygonPink",
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
    primaryGradient: "linear(to-br,rgb(20, 26, 85) 60%,primary 100%)",
    secondaryGradient: `linear-gradient(to bottom right, rgb(0, 6, 125), rgb(60, 51, 232))`,
    secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(0, 6, 125, 0.8), rgba(60, 51, 232,0.8))`,
  },
});
