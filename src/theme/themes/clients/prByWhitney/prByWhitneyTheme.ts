// perygonDarkTheme.ts
import { extendTheme } from "@chakra-ui/react";
import { baseTheme } from "../../baseTheme";

const colorPalette = {
  prByWhitneyPrimary: "black",
  prByWhitneySecondary: "white",
  prByWhitneyPebble: "rgb(243, 243, 243)",
  prByWhitneyHighlight: "rgb(239, 114, 39)",
};

export const prByWhitneyDefaultTheme = extendTheme(baseTheme, {
  colors: {
    ...baseTheme.colors,
    primary: colorPalette.prByWhitneyPrimary,
    secondary: colorPalette.prByWhitneySecondary,
    primaryButton: colorPalette.prByWhitneySecondary,
    elementBG: "rgb(255, 255, 255)",
    elementBG2: colorPalette.prByWhitneyPrimary,
    primaryTextColor: "rgb(0, 0, 0)",
    secondaryTextColor: "rgb(83, 83, 83)",
    themeTextColor: colorPalette.prByWhitneyHighlight,
  },

  gradients: {
    ...baseTheme.gradients,
    primaryGradient: `linear-gradient(to bottom right, ${colorPalette.prByWhitneyPebble}, ${colorPalette.prByWhitneyPebble})`,
    secondaryGradient: `linear-gradient(to bottom right, ${colorPalette.prByWhitneyPrimary}, ${colorPalette.prByWhitneyPrimary})`,
    secondaryGradientTransparent: `linear-gradient(to bottom right, hsla(23, 86%, 55%, 0.7) 100%, rgb(253, 204, 174, 0.7) 50%)`,
  },

  fringeCases: {
    recognitionCard: {
      elementBG: "rgb(243, 169, 124)",
      textColor: "white",
      primaryTextColor: "white",
      secondaryTextColor: "black",
    },
    navBar: {
      bgGradient: `linear-gradient(to bottom right, black, black)`,
      textColor: "primaryTextColor",
    },
    dashbBoardHeader: {
      textcolor: "black",
    },
  },

  components: {
    ...baseTheme.components,
    Button: {
      variants: {
        primary: {
          height: 12,
          backgroundColor: "secondary",
          color: "primary",
          border: "1px solid",
          borderColor: "secondary",
          _hover: {
            border: "1px solid",
            backgroundColor: "rgb(239, 114, 39)",
            color: "white",
          },
          _disabled: {
            color: "white",
            border: "none",
            backgroundColor: "primary",
          },
        },
        solid: {
          backgroundColor: "secondary",
          color: "primary",
          border: "1px solid",
          borderColor: "secondary",
          _hover: {
            backgroundColor: "prByWhitneyHighlight",
            color: "primary",
            borderColor: "primary",
          },
        },
      },
    },
  },

  borders: {
    // primaryBorder: "1px solid var(--chakra-colors-primary)",
    primaryBorder: "none",
  },

  shadows: {
    primaryShadow: "1px 2px 5px 1px rgba(68, 68, 68, 0.5)",
  },
});
