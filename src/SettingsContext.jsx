import { createContext, useContext } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const settings = {
    url: "https://ticketguru.hellmanstudios.fi/api",
    userName: "salesperson@test.com",
    userPass: "salesperson",
    ticketUsedErrorCode: "ERR_BAD_REQUEST",
    barcodeProperty: "barcode",
  };
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
