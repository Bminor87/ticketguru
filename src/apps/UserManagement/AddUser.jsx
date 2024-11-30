import React, { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import UserDialog from "./UserDialog";
import { useApiService } from "../../service/ApiProvider";

export default function AddUser({ getUsers, roles }) {
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    role: { id: 1 },
  });
  const { addUser } = useApiService();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: { id: 1 },
    });
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (event) => {
    setNewUser({
      ...newUser,
      role: roles.find((role) => role.id === event.target.value),
    });
  };

  const handleAddUser = async () => {
    try {
      await addUser(newUser);
      getUsers();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add User
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <UserDialog
          user={newUser}
          roles={roles}
          handleChange={handleChange}
          handleRoleChange={handleRoleChange}
        />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
