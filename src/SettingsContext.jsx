import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    applyDarkOrLightMode();
  };

  const applyDarkOrLightMode = () => {
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      setDarkMode(true);
    } else if (localStorage.getItem("darkMode") === "false") {
      setDarkMode(false);
    }
    applyDarkOrLightMode();
  }, []);

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
