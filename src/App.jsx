import React from "react";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Container, CssBaseline } from "@mui/material";

import { SettingsProvider } from "./SettingsContext";
import { ThemeProvider } from "./ThemeContext";
import { ApiProvider } from "./service/ApiProvider";
import { BasketProvider } from "./apps/TicketSales/BasketContext";
import Navigation from "./Navigation";

import { componentMap } from "./util/componentMap";

import menuJson from "./menu.json";

function App() {
  const menu = menuJson.menu;

  return (
    <Router>
      <SettingsProvider>
        <ThemeProvider>
          <ApiProvider>
            <BasketProvider>
              <CssBaseline />
              <Navigation />
              <Container maxWidth="xl" sx={{ mt: 4, mb: 1 }}>
                <Routes>
                  <Route path="/" element={<div>Awesome app</div>} />
                  {menu.map((category) =>
                    category.sections.flatMap((item) => (
                      <Route
                        key={item.name}
                        path={item.href}
                        element={React.createElement(
                          componentMap[item.component]
                        )} // Dynamically render component
                      />
                    ))
                  )}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Container>
            </BasketProvider>
          </ApiProvider>
        </ThemeProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
