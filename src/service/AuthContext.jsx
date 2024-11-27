import React, { createContext, useState, useEffect } from "react";
import { useApiService } from "./ApiProvider"; // Use ApiProvider's logic

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { login: apiLogin, logout: apiLogout } = useApiService(); // Use ApiProvider login/logout
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user details
  const [authError, setAuthError] = useState(null); // Track authentication errors

  // Initialize authentication state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password); // Use ApiProvider's login logic

      // Save user data
      const userToStore = { email, password, ...response };
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      setIsAuthenticated(true);

      setAuthError(null); // Clear errors
      return true; // Login successful
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.message || "Invalid email or password.");
      return false; // Login failed
    }
  };

  // Logout function
  const logout = () => {
    apiLogout(); // Use ApiProvider's logout logic
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
