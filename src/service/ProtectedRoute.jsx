import { useEffect } from "react";
import { useSettings } from "../SettingsContext";

const ProtectedRoute = ({ children }) => {
  const settings = useSettings();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!settings.userName || !settings.userPass) {
      if (storedUser?.userName && storedUser?.userPass) {
        settings.setUserName(storedUser.userName);
        settings.setUserPass(storedUser.userPass);
      } else {
        window.location.href = "/login"; // Redirect to login if no credentials
      }
    }
  }, [settings]);

  //   if (!settings.userName || !settings.userPass) {
  //     return null; // Prevent rendering until user is authenticated
  //   }

  return children; // Render protected content
};

export default ProtectedRoute;
