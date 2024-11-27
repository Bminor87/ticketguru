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

  const setUserName = (userName) => {
    settings.userName = userName;
  };

  const setUserPass = (userPass) => {
    settings.userPass = userPass;
  };

  const settings = {
    url: "https://ticketguru.hellmanstudios.fi",
    userName: "",
    userPass: "",
    ticketUsedErrorCode: "ERR_BAD_REQUEST",
    darkMode,
    toggleDarkMode,
    setUserName,
    setUserPass,
  };

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
