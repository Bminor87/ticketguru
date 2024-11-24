import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { AppBar, Toolbar, Typography, Container } from "@mui/material";

import { SettingsProvider } from "./SettingsContext";
import { ApiProvider } from "./service/ApiProvider";
import { BasketProvider } from "./apps/TicketSales/BasketContext";
import TicketScanner from "./apps/TicketScanner/TicketScanner";
import TicketSales from "./apps/TicketSales/TicketSales";

function App() {
  return (
    <SettingsProvider>
      <ApiProvider>
        <BasketProvider>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">TicketGuru</Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" sx={{ mt: 3, mb: 1 }}>
            {/** Add routing here */}
            <TicketSales />
          </Container>
        </BasketProvider>
      </ApiProvider>
    </SettingsProvider>
  );
}

export default App;
