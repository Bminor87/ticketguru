import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteUser({ currentUserId, getUsers }) {
  const { deleteUser } = useApiService();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(currentUserId);
      await getUsers();
      handleClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        color="error"
        startIcon={<DeleteIcon />}
      ></Button>
      {/* Use Dialog to confirm the user's intent to delete */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
