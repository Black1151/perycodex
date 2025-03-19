// ThemeProvider.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { themeRegistry, ThemeName } from "@/theme/themes/themeRegistry";

interface IThemeContext {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<IThemeContext>({
  themeName: "perygonLight",
  setThemeName: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface CustomThemeProviderProps {
  children: React.ReactNode;
  defaultThemeName?: ThemeName;
}

export const ChakraThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
  defaultThemeName = "perygonLight",
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultThemeName);
  const activeTheme = themeRegistry[themeName];

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <ChakraProvider theme={activeTheme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
