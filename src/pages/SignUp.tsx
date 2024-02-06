import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";
import GoogleIcon from "@mui/icons-material/Google";
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
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase";
import VerifyFirebaseErrorCode from "@/utils/firebase-auth-error";
import { signInWithGoogleNative } from "@/utils/native-google-login";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const signInWithGooglePopup = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

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
    showConfirmPassword: false,
  });
  const [isError, setIsError] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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
    prop: "showPassword" | "showConfirmPassword",
  ) => {
    setValues({
      ...values,
      [prop]:
        prop === "showPassword"
          ? !values.showPassword
          : !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const [email, password, confirm_password] = [
      values.email,
      values.password,
      values.confirmPassword,
    ];

    if (email === "" || password === "" || confirm_password === "") {
      setIsError({
        email: email === "" ? true : false,
        password: password === "" ? true : false,
        confirmPassword: confirm_password === "" ? true : false,
      });
      setIsLoading(false);
      toast.error("Password does not match.");
      return;
    }
    if (password !== confirm_password) {
      setIsError({
        email: false,
        password: true,
        confirmPassword: true,
      });
      setIsLoading(false);
      toast.error("Password does not match.");
      return;
    }
    try {
      await signUp(email, password);
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error && typeof error === "object" && "code" in error) {
        message = VerifyFirebaseErrorCode(error?.code);
      }
      setIsLoading(false);
      toast.error(message);
    }
  };

  const signInWithPopup = async () => {
    setIsLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await signInWithGoogleNative();
      } else {
        await signInWithGooglePopup();
      }
      setIsLoading(false);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error && typeof error === "object" && "code" in error) {
        message = VerifyFirebaseErrorCode(error?.code);
      }
      setIsLoading(false);
      toast.error(message);
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
            paddingTop: "16px",
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
                ),
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
                ),
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

            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              startIcon={<GoogleIcon />}
              onClick={signInWithPopup}
            >
              Continue With Google
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
