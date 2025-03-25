// themeRegistry.ts

import { perygonTheme } from "./perygon/perygonTheme/perygonTheme";
import { perygonThemeBlue } from "./perygon/perygonThemeBlue/perygonThemeBlue";
import { NeonSedulo } from "./perygon/perygonNeonSedulo/NeonSeduloTheme";
import { Moonlight } from "./perygon/perygonMoonlight/perygonMoonlight";
import { MinimalDark } from "./perygon/perygonMinimal/perygonMinimalDark";

export const themeRegistry = {
  perygonLight: perygonTheme,
  perygonBlue: perygonThemeBlue,
  perygonSeduloNeon: NeonSedulo,
  perygonMoonlight: Moonlight,
  perygonMinimalDark: MinimalDark,
};

export type ThemeName = keyof typeof themeRegistry;
