// ThemeProvider.tsx

import React, { createContext, useContext, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { themeRegistry, ThemeName } from "@/theme/themes/themeRegistry";

interface IThemeContext {
  themeId: ThemeName;
  setThemeId: (name: ThemeName) => void;
}

const ThemeContext = createContext<IThemeContext>({
  themeId: 1,
  setThemeId: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface CustomThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: ThemeName;
}

export const ChakraThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
  defaultThemeId = 1,
}) => {
  const [themeId, setThemeId] = useState<ThemeName>(defaultThemeId);
  const activeTheme = themeRegistry[themeId];

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId }}>
      <ChakraProvider theme={activeTheme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
