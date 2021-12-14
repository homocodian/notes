import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GoogleIcon from '@mui/icons-material/Google';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CustomDialog from '../CustomDailog';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import VerifyErroCode from '../../utils/authError';

interface State {
  email: string,
  password: string,
  confirmPassword: string,
  showPassword: boolean,
  showConfirmPassword: boolean
}

export default function SignUp() {

  const { signUp, signInWithGooglePopup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState<State>({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = (prop: 'showPassword' | 'showConfirmPassword') => {
    setValues({
      ...values,
      [prop]: prop === 'showPassword' ? !values.showPassword : !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const email = values.email;
    const password = values.password;
    const confirm_password = values.confirmPassword;

    if (email !== "" && password !== "" && confirm_password !== "") {
      if (password === confirm_password) {
        try {
          await signUp(email, password);
          setIsLoading(false);
          navigate("/",{replace:true});
        } catch (error) {
          // @ts-ignore
          setErrorMessage(VerifyErroCode(error.code));
          setOpen(true);
          setIsLoading(false);
        }
      } else {
        setErrorMessage("Password does not match.");
        setOpen(true);
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please fill all required fields.");
      setOpen(true);
      setIsLoading(false);
    }
  };

  const signInWithPopup = async () => {
    setIsLoading(true);
    try {
      await signInWithGooglePopup();
      setIsLoading(false);
      navigate("/")
    } catch (error) {
      // @ts-ignore
      setErrorMessage(VerifyErroCode(error.code));
      setOpen(true);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "text.primary" }}>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              value={values.email}
              onChange={handleChange('email')}
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
              onChange={handleChange('password')}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={values.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword('showPassword')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }}
            />
            <TextField
              name="confirm-password"
              label="Confirm Password"
              margin="normal"
              fullWidth
              required
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              type={values.showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword('showConfirmPassword')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
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
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <CustomDialog title="Sign up error" message={errorMessage} open={isOpen} setOpen={setOpen} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}