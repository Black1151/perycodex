"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ChakraProvider, Center, Spinner } from "@chakra-ui/react";
import { themeRegistry, ThemeName } from "@/theme/themes/themeRegistry";

interface IThemeContext {
  themeId: ThemeName;
  setThemeId: (theme: ThemeName) => void;
}

const ThemeContext = createContext<IThemeContext>({
  themeId: 2,
  setThemeId: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

export const ChakraThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  const [themeId, setThemeId] = useState<ThemeName | null>(null);

  useEffect(() => {
    const getUserTheme = async () => {
      try {
        const response = await fetch("/api/user/getUserMetadata");
        if (!response.ok) {
          throw new Error("Failed to fetch user metadata");
        }
        const data = await response.json();
        setThemeId(data.userThemeId ?? 2);
      } catch (error) {
        console.error("Error fetching user theme:", error);
        setThemeId(2);
      }
    };
    getUserTheme();
  }, []);

  useEffect(() => {
    if (themeId === null) return;

    const updateUserTheme = async () => {
      try {
        const response = await fetch("/api/user/updateUserDetails", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userThemeId: themeId }),
        });

        if (!response.ok) {
          throw new Error("Failed to update theme preference");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    };
    updateUserTheme();
  }, [themeId]);

  if (themeId === null) {
    return (
      <Center height="100vh">
        <Spinner />
      </Center>
    );
  }

  const activeTheme = themeRegistry[themeId];
  return (
    <ThemeContext.Provider value={{ themeId, setThemeId }}>
      <ChakraProvider theme={activeTheme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
