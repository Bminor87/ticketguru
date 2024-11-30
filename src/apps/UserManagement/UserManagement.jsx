import React, { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import EditUsers from "./EditUsers";
import AddUser from "./AddUser";
import DeleteUser from "./DeleteUser";
import { useSettings } from "../../SettingsContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const { fetchUsers, fetchRoles } = useApiService();

  const { darkMode } = useSettings();

  const columnDefs = [
    { field: "email", headerName: "Email", minWidth: 200 },
    { field: "firstName", headerName: "First Name", minWidth: 150 },
    { field: "lastName", headerName: "Last Name", minWidth: 150 },
    {
      field: "role",
      headerName: "Role",
      valueGetter: (params) => params.data.role?.title,
      minWidth: 150,
    },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <EditUsers currentUser={params.data} getUsers={getUsers} />
      ),
    },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <DeleteUser currentUserId={params.data.id} getUsers={getUsers} />
      ),
    },
  ];

  const onGridSizeChanged = (params) => {
    const gridWidth = document.querySelector(".ag-body-viewport").clientWidth;

    const columnsToShow = [];
    const columnsToHide = [];

    let totalColsWidth = 0;
    const allColumns = params.api.getColumns();

    if (allColumns && allColumns.length > 0) {
      allColumns.forEach((column) => {
        totalColsWidth += column.getMinWidth();
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      });
    }

    params.api.setColumnsVisible(columnsToShow, true);
    params.api.setColumnsVisible(columnsToHide, false);

    window.setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 10);
  };

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };

  const getUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const getRoles = async () => {
    try {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <AddUser getUsers={getUsers} roles={roles} />
      </div>
      <div
        className={`ag-theme-material ${
          darkMode ? "ag-theme-material-dark" : ""
        }`}
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 100,
          }}
          onGridSizeChanged={onGridSizeChanged}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
    </div>
  );
}
