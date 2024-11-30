import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function PopupMessage({ opened, title, message, handleClose }) {
  return (
    <Dialog open={opened} onClose={handleClose}>
      <DialogTitle>{title || "No title"}</DialogTitle>
      <DialogContent>{message || "No message"}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
