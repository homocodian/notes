import { useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import FormDialog from "../FormDailog";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import CustomDialog from "../CustomDailog";
import Backdrop from "@mui/material/Backdrop";
import CustomSnackbar from "../CustomSnackbar";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import VerifyErroCode from "../../utils/authError";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

export default function SignIn() {
  const [isCustomDailogOpen, setIsCustomDailogOpen] = useState(false);
  const [isResetFormOpen, setIsResetFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn, signInWithGooglePopup, sendPasswordResetLink } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const email = values.email;
    const password = values.password;

    if (email !== "" && password !== "") {
      try {
        await signIn(email, password);
        setIsLoading(false);
        navigate("/");
      } catch (error) {
        // @ts-ignore
        setErrorMessage(VerifyErroCode(error.code));
        setIsCustomDailogOpen(true);
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please fill all required fields");
      setIsCustomDailogOpen(true);
      setIsLoading(false);
    }
  };

  const signInWithPopup = async () => {
    setIsLoading(true);
    try {
      await signInWithGooglePopup();
      setIsLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      // @ts-ignore
      setErrorMessage(VerifyErroCode(error.code));
      setIsCustomDailogOpen(true);
      setIsLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string, cb: () => void) => {
    try {
      await sendPasswordResetLink(email);
      cb();
      setIsResetFormOpen(false);
      setIsAlertOpen(true);
    } catch (error) {
      cb();
      // @ts-ignore
      setErrorMessage(VerifyErroCode(error.code));
      setIsCustomDailogOpen(true);
      setIsResetFormOpen(false);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ color: "text.primary" }}
          >
            Sign in
          </Typography>
          <Box component="form" sx={{ mt: 1 }} noValidate>
            <TextField
              value={values.email}
              onChange={handleChange("email")}
              margin="normal"
              id="email"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={values.password}
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
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              startIcon={!isLoading ? <GoogleIcon /> : null}
              onClick={signInWithPopup}
            >
              Continue With Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsResetFormOpen(true);
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <FormDialog
        isOpen={isResetFormOpen}
        setOpen={setIsResetFormOpen}
        title="Reset Password"
        content="To reset your password, please enter your email address here. We will send you reset link on your mail."
        positiveButtonLabel="Send"
        textFieldLabel="Email Address"
        textFieldType="email"
        positiveButtonAction={sendPasswordResetEmail}
      />
      <CustomDialog
        title={"Login Error"}
        message={errorMessage}
        open={isCustomDailogOpen}
        setOpen={setIsCustomDailogOpen}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CustomSnackbar
        alertType="success"
        message="Email has been sent"
        open={isAlertOpen}
        setOpen={setIsAlertOpen}
      />
    </>
  );
}
