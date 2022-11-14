import { useEffect, useState } from "react";

import {
	Box,
	Grid,
	Link,
	Avatar,
	Button,
	Backdrop,
	Container,
	IconButton,
	Typography,
	TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router";

import FormDialog from "../components/FormDailog";
import CustomDialog from "../components/CustomDailog";
import CustomSnackbar from "../components/CustomSnackbar";
import VerifyErroCode from "../utils/authError";
import { useAuth } from "../context/AuthContext";

interface State {
	email: string;
	password: string;
	showPassword: boolean;
}

export default function SignIn() {
	const [values, setValues] = useState<State>({
		email: "",
		password: "",
		showPassword: false,
	});
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [isResetFormOpen, setIsResetFormOpen] = useState(false);
	const [isCustomDailogOpen, setIsCustomDailogOpen] = useState(false);
	const { signIn, signInWithGooglePopup, sendPasswordResetLink, user } =
		useAuth();

	// check for user
	useEffect(() => {
		if (user) {
			navigate("/", { replace: true });
		}
	}, [user]);

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
				// setIsLoading(false);
				// navigate("/");
			} catch (error: any) {
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
			// setIsLoading(false);
			// navigate("/", { replace: true });
		} catch (error: any) {
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
		} catch (error: any) {
			cb();
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
						<LockIcon />
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
						{Capacitor.getPlatform() === "web" && (
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
						)}
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
