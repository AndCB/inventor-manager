import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useAuth } from "../../Contexts/AuthContext";
import { useSnackbar } from "../../Contexts/SnackBarContext";

type AuthMode = "login" | "register";

const getAuthErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return "Invalid username or password.";
    if (status === 409) return "Username is already taken.";
    if (status === 400) return "Please check your details and try again.";
  }
  return "Something went wrong. Please try again.";
};

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const snackbar = useSnackbar();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeChange = (_event: React.SyntheticEvent, newMode: AuthMode) => {
    setMode(newMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegister && password !== confirmPassword) {
      snackbar.openSnackbarWithMessage("Passwords do not match.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(username, password);
        snackbar.openSnackbarWithMessage("Welcome back!", "success");
      } else {
        await register(username, password);
        snackbar.openSnackbarWithMessage("Account created. Welcome!", "success");
      }
      // On success the parent switches to the inventory view automatically.
    } catch (error) {
      snackbar.openSnackbarWithMessage(getAuthErrorMessage(error), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4"
      sx={{
        background: "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
      }}
    >
      <Card
        className="w-full max-w-md"
        sx={{ borderRadius: 3, boxShadow: 8 }}
      >
        <CardContent className="flex flex-col gap-4 p-8">
          <Typography variant="h5" component="h1" align="center" fontWeight={600}>
            Inventory Manager
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {isRegister
              ? "Create an account to manage inventory."
              : "Sign in to manage inventory."}
          </Typography>

          <Tabs
            value={mode}
            onChange={handleModeChange}
            variant="fullWidth"
            aria-label="authentication mode"
          >
            <Tab value="login" label="Login" />
            <Tab value="register" label="Register" />
          </Tabs>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
              helperText={
                isRegister
                  ? "At least 6 characters with uppercase, lowercase, a number, and a special character."
                  : undefined
              }
            />
            {isRegister && (
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                error={confirmPassword !== "" && confirmPassword !== password}
                helperText={
                  confirmPassword !== "" && confirmPassword !== password
                    ? "Passwords do not match."
                    : undefined
                }
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
            >
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthPage;
