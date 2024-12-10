import { createContext, useContext, useState, useEffect, useMemo } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    applyDarkOrLightMode(newDarkMode);
  };

  const applyDarkOrLightMode = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Load dark mode setting from localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      const isDarkMode = storedDarkMode === "true";
      setDarkMode(isDarkMode);
      applyDarkOrLightMode(isDarkMode);
    }

    // Load user information from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.userName);
      setUserPass(user.userPass);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setRole(user.role);
    }
  }, [darkMode]);

  const settings = useMemo(
    () => ({
      url: "https://ticketguru.hellmanstudios.fi",
      userName: userName,
      userPass: userPass,
      firstName: firstName,
      lastName: lastName,
      role: role,
      ticketUsedErrorCode: "ERR_BAD_REQUEST",
      darkMode,
      toggleDarkMode,
      setUserName,
      setUserPass,
      setRole,
      setFirstName,
      setLastName,
    }),
    [darkMode, userName, userPass, firstName, lastName, role]
  );

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
