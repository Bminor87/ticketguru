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

import { CssBaseline } from "@mui/material";

import { SettingsProvider } from "./SettingsContext";
import { ThemeProvider } from "./ThemeContext";
import { ApiProvider } from "./service/ApiProvider";
import { BasketProvider } from "./apps/TicketSales/BasketContext";
import Layout from "./Layout";

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

              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<div>Awesome app</div>} />
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
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BasketProvider>
          </ApiProvider>
        </ThemeProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
