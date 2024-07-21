import LockIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography
} from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import { SESSION_TOKEN_KEY } from "@/constant/auth";
import { APIError } from "@/lib/api-error";
import { fetchAPI } from "@/lib/fetch-wrapper";
import { useAuthStore } from "@/store/auth";

interface InputFields {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export default function SignUp() {
  const [values, setValues] = useState<InputFields>({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false
  });
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore(
    useShallow((state) => ({ user: state.user, setUser: state.setUser }))
  );
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  // check for user
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, []);

  const handleChange =
    (prop: keyof InputFields) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = (
    prop: "showPassword" | "showConfirmPassword"
  ) => {
    setValues({
      ...values,
      [prop]:
        prop === "showPassword"
          ? !values.showPassword
          : !values.showConfirmPassword
    });
  };

  const handleSubmit = async () => {
    setShowPasswordRules(false);
    setIsError({
      email: false,
      password: false,
      confirmPassword: false
    });

    const [email, password, confirmPassword] = [
      values.email,
      values.password,
      values.confirmPassword
    ];

    if (email === "" || password === "" || confirmPassword === "") {
      setIsError({
        email: email === "" ? true : false,
        password: password === "" ? true : false,
        confirmPassword: confirmPassword === "" ? true : false
      });
      toast.error("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setIsError({
        email: false,
        password: true,
        confirmPassword: true
      });
      toast.error("Password does not match.");
      return;
    }

    if (password.length < 8) {
      setIsError({
        email: false,
        password: true,
        confirmPassword: true
      });
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await fetchAPI.post("/v1/auth/register", {
        data: {
          email,
          password
        },
        // auto abort in 2 minutes
        options: { signal: AbortSignal.timeout(1000 * 60 * 2) }
      });

      if (
        !data?.sessionToken ||
        !data.id ||
        !data.email ||
        typeof data.emailVerified !== "boolean"
      ) {
        throw new Error("Invalid Session");
      }

      localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);

      setUser({
        id: data.id,
        email: data.email,
        emailVerified: data.emailVerified,
        photoURL: data?.photoURL,
        displayName: data?.displayName
      });

      navigate("/verify");
    } catch (error: unknown) {
      if (error instanceof APIError) {
        if (error.message.includes("Invalid password"))
          setShowPasswordRules(true);
        return toast.error(error.message);
      }
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "16px"
          }}
        >
          {showPasswordRules ? (
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
          ) : (
            <>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                sx={{ color: "text.primary" }}
              >
                Sign Up
              </Typography>
            </>
          )}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            sx={{ mt: 1 }}
            id="signup-form"
          >
            <TextField
              value={values.email}
              error={isError.email}
              onChange={handleChange("email")}
              margin="normal"
              id="email"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
            />
            <TextField
              value={values.password}
              error={isError.password}
              onChange={handleChange("password")}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={values.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword("showPassword")}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              name="confirm-password"
              label="Confirm Password"
              error={isError.confirmPassword}
              margin="normal"
              fullWidth
              required
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              type={values.showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        handleClickShowPassword("showConfirmPassword")
                      }
                      edge="end"
                    >
                      {values.showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              form="signup-form"
              type="submit"
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item sx={{ mt: 2 }}>
                <Link href="/login" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
