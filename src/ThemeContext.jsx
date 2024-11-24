import React, { createContext, useContext, useMemo } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useSettings } from "./SettingsContext";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { darkMode } = useSettings(); // Access darkMode from SettingsContext

  // Create the theme based on the darkMode state
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#303030" : "#fafafa",
            paper: darkMode ? "#424242" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
            secondary: darkMode ? "#b0b0b0" : "#6d6d6d",
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
