import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

import { SESSION_TOKEN_KEY } from "@/constant/auth";
import { APIError } from "@/lib/api-error";
import { fetchAPI } from "@/lib/fetch-wrapper";
import { useAuthStore } from "@/store/auth";

function PasswordResetPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string | null;
    const confirmPassword = form.get("confirm-password") as string | null;

    if (!password || !confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      toast.error("Invalid token");
      return;
    }

    setPending(true);

    try {
      const { sessionToken, ...user } = await fetchAPI.post<{
        id: number;
        email: string;
        emailVerified: boolean;
        photoURL?: string | null;
        displayName?: string | null;
        sessionToken: string;
      }>(`/v1/auth/reset-password/${token}`, {
        data: { password: password.trim() }
      });

      localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      setUser(user);
      setShowError(false);
      navigate("/");
    } catch (error) {
      if (error instanceof APIError) {
        if (
          error.status === 400 &&
          error.message.includes("Invalid password")
        ) {
          setShowError(true);
        }
        return toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Box
      height="100%"
      display="grid"
      sx={{
        placeContent: "center"
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box component="form" sx={{ mt: 1 }} noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setshowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {showError && (
            <Alert severity="error" variant="outlined">
              <ul>
                <li>Password must be 8 characters long.</li>
                <li>At least one digit.</li>
                <li>At least one of the allowed special symbols: !@#$%*&.</li>
                <li>At least one uppercase letter.</li>
                <li>At least one lowercase letter.</li>
                <li>No whitespaces.</li>
              </ul>
            </Alert>
          )}
          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            type="submit"
            loading={pending}
          >
            Submit
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  );
}

export default PasswordResetPage;
