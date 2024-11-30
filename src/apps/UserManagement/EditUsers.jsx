import React, { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserDialog from "./UserDialog";

export default function EditUsers({ currentUser, getUsers }) {
  const [user, setUser] = useState(currentUser);
  const [open, setOpen] = useState(false);
  const { updateUser, fetchRoles } = useApiService();
  const [roles, setRoles] = useState([]);

  const handleOpen = async () => {
    const fetchedRoles = await fetchRoles();
    setRoles(fetchedRoles);
    setOpen(true);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    await updateUser(user.id, user);
    await getUsers();
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<EditIcon />}></Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <UserDialog user={user} roles={roles} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
