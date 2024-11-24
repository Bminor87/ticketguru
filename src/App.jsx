import "./App.css";
import AppContext from "./AppContext";
import { ApiProvider } from "./service/ApiProvider";
import TicketScanner from "./apps/TicketScanner/TicketScanner";

const settings = {
  url: "https://ticketguru.hellmanstudios.fi",
  ticketUsedErrorCode: "ERR_BAD_REQUEST",
  barcodeProperty: "barcode",
  username: "admin@test.com",
  password: "admin",
};

function App() {
  return (
    <AppContext.Provider value={{ settings }}>
      <ApiProvider>
        <TicketScanner />
      </ApiProvider>
    </AppContext.Provider>
  );
}

export default App;
