// themeRegistry.ts

import { perygonTheme } from "./perygon/perygonTheme/perygonTheme";
import { perygonThemeDark } from "./perygon/perygonThemeDark/perygonThemeDark";

export const themeRegistry = {
  perygonLight: perygonTheme,
  perygonDark: perygonThemeDark,
};

export type ThemeName = keyof typeof themeRegistry;
