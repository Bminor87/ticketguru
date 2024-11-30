import React from "react";
import {
  TextField,
  DialogContent,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function UserDialog({
  user,
  roles,
  handleChange,
  handleRoleChange,
  validationErrors,
  setValidationErrors,
  isNewUser = false, // Distinguish between creating and editing
}) {
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    // Update the user object
    handleChange(e);

    // Check if passwords match
    const newErrors = validationErrors.filter(
      (error) => error.id !== "passwords-match"
    );

    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        user.password = value; // Ensure the user object updates immediately
      } else {
        user.confirmPassword = value;
      }

      if (user.password !== user.confirmPassword) {
        newErrors.push({
          id: "passwords-match",
          message: "Passwords do not match",
        });
      }
    }

    setValidationErrors(newErrors);
  };

  return (
    <div>
      <DialogContent>
        <Stack spacing={2} width="100%">
          <TextField
            autoFocus
            required
            name="email"
            type="email"
            label="Email"
            value={user.email || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            name="firstName"
            label="First Name"
            value={user.firstName || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            name="lastName"
            label="Last Name"
            value={user.lastName || ""}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={user.role?.id || ""}
              onChange={handleRoleChange}
            >
              {roles?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Password Fields */}
          <TextField
            required={isNewUser} // Make password required for new users
            name="password"
            label="Password"
            type="password"
            value={user.password || ""}
            onChange={handlePasswordChange}
            fullWidth
          />
          <TextField
            required={isNewUser} // Make password confirmation required for new users
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={user.confirmPassword || ""}
            onChange={handlePasswordChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
    </div>
  );
}
