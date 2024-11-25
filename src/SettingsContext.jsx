import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const settings = {
    url: "https://ticketguru.hellmanstudios.fi", // Ensure this is correct
    userName: "admin@test.com",
    userPass: "admin",
    ticketUsedErrorCode: "ERR_BAD_REQUEST",
    darkMode,
    toggleDarkMode,
  };

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
