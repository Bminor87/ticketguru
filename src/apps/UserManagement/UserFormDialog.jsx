import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import UserDialog from "./UserDialog";

export default function UserFormDialog({
  mode, // "add" or "edit"
  currentUser = null,
  roles,
  onSave, // Callback for saving the user
  onClose,
}) {
  const [user, setUser] = useState(
    currentUser || {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: { id: roles?.[0]?.id || 1 },
    }
  );
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const updatedUser = { ...user, [e.target.name]: e.target.value };
    setUser(updatedUser);
    validateForm(updatedUser);
  };

  const handleRoleChange = (event) => {
    const updatedUser = {
      ...user,
      role: roles.find((role) => role.id === event.target.value),
    };
    setUser(updatedUser);
    validateForm(updatedUser);
  };

  const validateForm = (currentUser) => {
    const errors = [];

    // Check required fields
    if (!currentUser.email) {
      errors.push({ id: "email-required", message: "Email is required." });
    }
    if (!currentUser.firstName) {
      errors.push({
        id: "firstName-required",
        message: "First Name is required.",
      });
    }
    if (!currentUser.lastName) {
      errors.push({
        id: "lastName-required",
        message: "Last Name is required.",
      });
    }
    if (!currentUser.role?.id) {
      errors.push({ id: "role-required", message: "Role is required." });
    }

    // Check email validity
    if (!currentUser.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      errors.push({
        id: "email-invalid",
        message: "Email is invalid.",
      });
    }

    // Check password match
    if (currentUser.password || currentUser.confirmPassword) {
      if (currentUser.password !== currentUser.confirmPassword) {
        errors.push({
          id: "passwords-match",
          message: "Passwords do not match.",
        });
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm(user)) return;
    await onSave(user);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
      <UserDialog
        user={user}
        roles={roles}
        handleChange={handleChange}
        handleRoleChange={handleRoleChange}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={validationErrors.length > 0}
        >
          {mode === "add" ? "Add" : "Save"}
        </Button>
      </DialogActions>
      {validationErrors?.map((error) => (
        <p key={error.id} className="text-red-800 error">
          {error.message}
        </p>
      ))}
    </Dialog>
  );
}
