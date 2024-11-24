import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  // Initialize dark mode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    // Get initial value from localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true"; // Convert string to boolean
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode); // Persist to localStorage

    if (newDarkMode) {
      document.documentElement.classList.add("dark"); // Add Tailwind's 'dark' class
    } else {
      document.documentElement.classList.remove("dark"); // Remove Tailwind's 'dark' class
    }
  };

  // Sync dark mode with Tailwind's class on initial render
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const settings = {
    url: "https://ticketguru.hellmanstudios.fi/api",
    userName: "admin@test.com",
    userPass: "admin",
    ticketUsedErrorCode: "ERR_BAD_REQUEST",
    barcodeProperty: "barcode",
    darkMode, // Include darkMode in settings
    toggleDarkMode, // Include toggle function
  };

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
