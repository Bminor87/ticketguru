import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { Add, DeleteForever, Remove } from "@mui/icons-material";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

import { useBasket } from "./BasketContext";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";

export default function Basket({
  setSoldTicketsData,
  setSelectedEventId,
  setSelectedTicketTypeId,
}) {
  const { basket, setBasket, removeFromBasket, plusOneTicket, minusOneTicket } =
    useBasket();
  const { darkMode } = useSettings(); // Access darkMode and API URL from settings
  const { postBasketItems } = useApiService();

  const [columnDefs, setColumnDefs] = useState([
    { field: "eventName", headerName: "Event Name" },
    { field: "name", headerName: "Name", width: 120 },
    { field: "price", headerName: "Price (€)", width: 100 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    {
      headerName: "Subtotal (€)",
      width: 100,
      valueGetter: (params) => params.data.price * params.data.quantity,
      valueFormatter: (params) => params.value.toFixed(2),
    },
    {
      headerName: "",
      cellRenderer: (params) => (
        <>
          <Button color="primary" onClick={() => plusOneTicket(params.data)}>
            <Add />
          </Button>
          <Button
            color={params.data.quantity != 1 ? "primary" : "gray"}
            onClick={() => minusOneTicket(params.data)}
          >
            <Remove />
          </Button>
          <Button color="error" onClick={() => removeFromBasket(params.data)}>
            <DeleteForever />
          </Button>
        </>
      ),
    },
  ]);

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  const handleConfirmSale = async () => {
    if (!basket || basket.length === 0) return;
    try {
      const response = await postBasketItems(basket);
      if (response) {
        setSoldTicketsData(response);
        handleClearBasket();
        setSelectedEventId(0);
        setSelectedTicketTypeId(0);
      }
    } catch (error) {
      console.error("Error posting basket: ", error);
    }
  };

  const handleClearBasket = () => {
    setBasket([]);
  };

  const grandTotal = useMemo(() => {
    return basket
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [basket]);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Basket</h2>

      <div
        className={`ag-theme-material ${
          darkMode ? "ag-theme-material-dark" : ""
        }`}
        style={{ height: "300px" }}
      >
        <AgGridReact
          rowData={basket}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          groupTotalRow={true}
          autoSizeStrategy={autoSizeStrategy}
        />
      </div>

      <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-4">
        <p className="text-lg font-bold">
          Grand Total: <span className="text-indigo-600">{grandTotal}€</span>
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleConfirmSale}
            className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
          >
            Confirm Sale
          </button>
          <button
            onClick={handleClearBasket}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
          >
            Clear Basket
          </button>
        </div>
      </div>
    </div>
  );
}
