import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { useSettings } from "../../SettingsContext";
import { useApiService } from "../../service/ApiProvider";
import dayjs from "dayjs";
import ViewTransaction from "./ViewTransaction";

export default function TransactionsList() {
  const { darkMode } = useSettings();
  const { fetchSales } = useApiService();
  const [sales, setSales] = useState([]);

  const currencyFormatter = (value) => {
    if (value == null) return 0;
    return Number(value).toLocaleString("fi-FI", {
      style: "currency",
      currency: "EUR",
    });
  };

  const defaultColumnDefs = {
    sortable: true,
    resizable: true,
  };

  const getSales = async () => {
    try {
      const fetchedSales = await fetchSales();
      setSales(fetchedSales);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", headerName: "Sale Id" },
    {
      field: "paidAt",
      headerName: "Transaction date and time",
      valueFormatter: (params) => dayjs(params.data.paidAt),
    },
    { field: "userId", headerName: "Sales Agent" },
    {
      field: "tickets",
      headerName: "Nr. Tickets Sold",
      valueGetter: (params) => params.data.ticketIds.length,
    },
    {
      field: "transactionTotal",
      headerName: "Transaction Total",
      valueFormatter: (params) =>
        currencyFormatter(params.data.transactionTotal),
    },
    {
      cellRenderer: (params) => <ViewTransaction sale={params.data} />,
    },
  ]);

  const autoSizeStrategy = {
    type: "fitCellContents",
    flex: 1,
  };

  return (
    <div
      className={`ag-theme-material ${
        darkMode ? "ag-theme-material-dark" : ""
      }`}
      style={{ minHeight: "500px", width: "80%" }}
    >
      <AgGridReact
        rowData={sales}
        defaultColDef={defaultColumnDefs}
        columnDefs={columnDefs}
        autoSizeStrategy={autoSizeStrategy}
      />
    </div>
  );
}
