// perygonLightTheme.ts
import { extendTheme } from "@chakra-ui/react";

import { colorPalette } from "./colorPalette"; 
import { baseTheme } from "../../baseTheme";

export const perygonTheme = extendTheme(
  baseTheme,
  { 
    colors: {
      ...baseTheme.colors,
      primary: colorPalette.perygonPink,
      secondary: colorPalette.seduloRed,
      primaryButton: colorPalette.seduloRed,
    },

    gradients: {
      ...baseTheme.gradients,
      primaryGradient: "linear(to-br, secondary 60%, primary 100%)",
      secondaryGradient: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.6), rgba(255, 192, 203, 0.6))`,
      secondaryGradientTransparent: `linear-gradient(to bottom right, rgba(255, 0, 0, 0.3), rgba(255, 192, 203, 0.3))`,
    },

    components: {
      ...baseTheme.components,
    },
  }
);
