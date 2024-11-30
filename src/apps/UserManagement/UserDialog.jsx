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
  handlePasswordChange, // Separate handler for passwords
  isNewUser = false, // Distinguish between creating and editing
}) {
  return (
    <div>
      <DialogContent>
        <Stack spacing={2} width="100%">
          <TextField
            autoFocus
            required
            name="email"
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
              value={user.role?.title || ""}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "role",
                    value: roles.find((r) => r.title === e.target.value),
                  },
                })
              }
            >
              {roles.map((role) => (
                <MenuItem key={role.title} value={role.title}>
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
