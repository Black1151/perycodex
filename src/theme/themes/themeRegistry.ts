// themeRegistry.ts

import { perygonTheme } from "./perygon/perygonTheme/perygonTheme";
import { perygonThemeBlue } from "./perygon/perygonThemeBlue/perygonThemeBlue";
import { NeonSedulo } from "./perygon/perygonNeonSedulo/NeonSeduloTheme";
import { Moonlight } from "./perygon/perygonMoonlight/perygonMoonlight";
import { MinimalDark } from "./perygon/perygonMinimal/perygonMinimalDark";

export const themeRegistry: Record<number, any> = {
  1: perygonTheme,
  2: perygonThemeBlue,
  3: NeonSedulo,
  4: Moonlight,
  5: MinimalDark,
};

export type ThemeName = keyof typeof themeRegistry;
