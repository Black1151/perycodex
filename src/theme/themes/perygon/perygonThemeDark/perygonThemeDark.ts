// perygonDarkTheme.ts
import { extendTheme } from "@chakra-ui/react";
import { colorPalette } from "./colorPalette";
import { baseTheme } from "../../baseTheme";


export const perygonThemeDark = extendTheme(
  baseTheme,
  {
    colors: {
      ...baseTheme.colors,
      primary: colorPalette.perygonDark,
      secondary: colorPalette.perygonPurple,
      primaryButton: colorPalette.perygonPurple,
    },

    gradients: {
      ...baseTheme.gradients,
      primaryGradient: "linear(to-br, rgb(20, 26, 85) 60%, primary 100%)",
      secondaryGradient: `linear-gradient(to bottom right, rgb(0, 6, 125), rgb(60, 51, 232))`,
      secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(0, 6, 125, 0.8), rgba(60, 51, 232,0.8))`,
    },

    components: {
      ...baseTheme.components,
      Button: {
        variants: {
          primary: {
            mt: 5,
            w: "full",
            height: 12,
            backgroundColor: "secondary",
            color: "white",
            border: "1px solid",
            borderColor: "white",
            _hover: {
              color: "secondary",       
              border: "1px solid",
              backgroundColor: "white",
              _disabled: {
                color: "white",
                border: "none",
                backgroundColor: "primary", 
                
              },
            },
          },
        },
      },
    },
  }
);
