import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserFormDialog from "./UserFormDialog";
import { useApiService } from "../../service/ApiProvider";

const EditUsers = forwardRef(({ currentUser, getUsers, roles }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateUser } = useApiService();

  useImperativeHandle(ref, () => ({
    openEditor() {
      setOpen(true);
    },
  }));

  const handleEditUser = async (updatedUser) => {
    await updateUser(updatedUser.id, updatedUser);
    getUsers(true);
    setOpen(false);
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
});

export default EditUsers;
