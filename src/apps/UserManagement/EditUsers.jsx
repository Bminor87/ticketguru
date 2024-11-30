import React, { useState } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserFormDialog from "./UserFormDialog";
import { useApiService } from "../../service/ApiProvider";

export default function EditUsers({ currentUser, getUsers, roles }) {
  const [open, setOpen] = useState(false);
  const { updateUser } = useApiService();

  const handleEditUser = async (updatedUser) => {
    await updateUser(updatedUser.id, updatedUser);
    getUsers(true);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} startIcon={<EditIcon />}></Button>
      {open && (
        <UserFormDialog
          mode="edit"
          currentUser={currentUser}
          roles={roles}
          onSave={handleEditUser}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
