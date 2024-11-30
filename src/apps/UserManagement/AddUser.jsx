import React, { useState } from "react";
import { Button } from "@mui/material";
import UserFormDialog from "./UserFormDialog";
import { useApiService } from "../../service/ApiProvider";

export default function AddUser({ getUsers, roles }) {
  const [open, setOpen] = useState(false);
  const { addUser } = useApiService();

  const handleAddUser = async (newUser) => {
    await addUser(newUser);
    getUsers(true);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add User
      </Button>
      {open && (
        <UserFormDialog
          mode="add"
          roles={roles}
          onSave={handleAddUser}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
