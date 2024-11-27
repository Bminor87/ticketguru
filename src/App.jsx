import React, { useEffect } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";

import { SettingsProvider, useSettings } from "./SettingsContext";
import { ThemeProvider } from "./ThemeContext";
import { ApiProvider } from "./service/ApiProvider";
import { BasketProvider } from "./apps/TicketSales/BasketContext";

import Layout from "./Layout";
import Login from "./Login";
import FrontPage from "./apps/FrontPage/FrontPage";
import { componentMap } from "./util/componentMap";
import menuJson from "./menu.json";

import ProtectedRoute from "./service/ProtectedRoute";

function App() {
  const menu = menuJson.menu;

  return (
    <Router>
      <SettingsProvider>
        <ThemeProvider>
          <ApiProvider>
            <BasketProvider>
              <CssBaseline />
              <Routes>
                {/* Login Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Container maxWidth="xl" sx={{ mt: 4, mb: 1 }}>
                          <Routes>
                            <Route path="/" element={<FrontPage />} />
                            {menu.map((category) =>
                              category.sections.flatMap((item) => (
                                <Route
                                  key={item.name}
                                  path={item.href}
                                  element={React.createElement(
                                    componentMap[item.component]
                                  )}
                                />
                              ))
                            )}
                            <Route
                              path="*"
                              element={<Navigate to="/" replace />}
                            />
                          </Routes>
                        </Container>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BasketProvider>
          </ApiProvider>
        </ThemeProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
