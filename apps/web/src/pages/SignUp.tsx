import LockIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
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
import { api } from "@/lib/eden";
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

  // check for user
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

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

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

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
      setIsLoading(false);
      toast.error("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setIsError({
        email: false,
        password: true,
        confirmPassword: true
      });
      setIsLoading(false);
      toast.error("Password does not match.");
      return;
    }

    try {
      const { data, error } = await api.v1.auth.register.post(
        {
          email,
          password,
          confirmPassword
        },
        // auto abort in 2 minutes
        { fetch: { signal: AbortSignal.timeout(1000 * 60 * 2) } }
      );

      if (error) return toast.error(error.value);

      localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);

      setUser({
        id: data.id,
        email: data.email,
        emailVerified: data.emailVerified
      });
    } catch (error: unknown) {
      if (error instanceof Error) return toast.error(error.message);

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
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault(), handleSubmit();
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
                      onMouseDown={handleMouseDownPassword}
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
                      onMouseDown={handleMouseDownPassword}
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

            {/* <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              startIcon={<GoogleIcon />}
              // onClick={signInWithPopup}
            >
              Continue With Google
            </Button> */}
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
