import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteVenue({ currentVenueId, getVenues }) {
  const { deleteVenue } = useApiService();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteVenue(currentVenueId);
    await getVenues(true);
    handleClose();
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        color='error'
        startIcon={<DeleteIcon />}></Button>
      {/*We use Dialog instead of alert to confirm user's intent to delete the venue */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete venue</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the venue?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
