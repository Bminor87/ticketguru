import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { Add, DeleteForever, Remove } from "@mui/icons-material";
import PopupMessage from "../../common/PopupMessage";

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [popup, setPopup] = useState({ open: false, message: "", title: "" });

  const defaultColumnDefs = {
    sortable: true,
    resizable: true,
    minWidth: 100,
  };

  const fullColumnDefs = [
    { field: "eventName", headerName: "Event Name", minWidth: 150 },
    { field: "name", headerName: "Type", minWidth: 120 },
    { field: "price", headerName: "Price (€)", minWidth: 100, maxWidth: 120 },
    { field: "quantity", headerName: "Quantity", minWidth: 100, maxWidth: 120 },
    {
      headerName: "Subtotal (€)",
      minWidth: 120,
      maxWidth: 150,
      valueGetter: (params) => params.data.price * params.data.quantity,
      valueFormatter: (params) => params.value.toFixed(2),
    },
    {
      headerName: "",
      minWidth: 70,
      maxWidth: 80,
      cellRenderer: (params) => (
        <Button
          color="primary"
          onClick={() => plusOneTicket(params.data)}
          style={{ minWidth: "40px" }}
        >
          <Add />
        </Button>
      ),
    },
    {
      headerName: "",
      minWidth: 70,
      maxWidth: 80,
      cellRenderer: (params) => (
        <Button
          color={params.data.quantity > 1 ? "primary" : "gray"}
          onClick={() => minusOneTicket(params.data)}
          style={{ minWidth: "40px" }}
        >
          <Remove />
        </Button>
      ),
    },
    {
      headerName: "",
      minWidth: 70,
      maxWidth: 80,
      cellRenderer: (params) => (
        <Button
          color="error"
          onClick={() => removeFromBasket(params.data)}
          style={{ minWidth: "40px" }}
        >
          <DeleteForever />
        </Button>
      ),
    },
  ];

  const mobileColumnDefs = [
    { field: "eventName", headerName: "Event", maxWidth: 160 },
    { field: "name", headerName: "Type", maxWidth: 100 },
    { field: "quantity", headerName: "Q", maxWidth: 60 },
    {
      headerName: "",
      maxWidth: 60,
      cellRenderer: (params) => (
        <Button
          color="error"
          onClick={() => removeFromBasket(params.data)}
          style={{ minWidth: "40px" }}
        >
          <DeleteForever />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleConfirmSale = async () => {
    if (!basket || basket.length === 0) {
      setPopup({
        title: "Empty basket",
        message: "Basket is empty",
        open: true,
      });
      return;
    }

    try {
      const response = await postBasketItems(basket);
      if (response) {
        setSoldTicketsData(response);
        handleClearBasket();
        setSelectedEventId(0);
        setSelectedTicketTypeId(0);
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response && error.response.status === 422) {
        // Handle specific 422 errors
        errorMessage =
          error.response.data?.message ||
          "Some items in the basket are no longer available.";
      }

      setPopup({
        title: "Error",
        message: errorMessage,
        open: true,
      });

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
    <div className="bg-transparent shadow-md rounded-lg w-full">
      <h2 className="text-xl font-bold mb-4">Basket</h2>

      <div
        className={`ag-theme-material ${
          darkMode ? "ag-theme-material-dark" : ""
        }`}
        style={{ height: "300px", width: "100%" }}
      >
        <AgGridReact
          rowData={basket}
          columnDefs={isMobile ? mobileColumnDefs : fullColumnDefs}
          defaultColDef={defaultColumnDefs}
          domLayout="autoHeight"
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
          onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
        />
      </div>

      <PopupMessage
        opened={popup.open}
        title={popup.title}
        message={popup.message}
        handleClose={() => {
          setPopup({ title: "", message: "", open: false });
        }}
      />

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
