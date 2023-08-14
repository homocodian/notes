import { useEffect, useState } from "react";

import {
	Box,
	Grid,
	Link,
	Avatar,
	Button,
	Backdrop,
	TextField,
	Typography,
	IconButton,
	InputAdornment,
	CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { Capacitor } from "@capacitor/core";

import { useAuth } from "@/context/AuthContext";
import VerifyFirebaseErrorCode from "@/utils/authError";
import CustomSnackbar from "@/components/CustomSnackbar";

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
	const [alert, setAlert] = useState({
		message: "",
		isOpen: false,
	});
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const { signUp, signInWithGooglePopup, user } = useAuth();

	// check for user
	useEffect(() => {
		if (user) {
			navigate("/", { replace: true });
		}
	}, [user]);

	const handleSnackbarToggle = (prop: boolean) => {
		setAlert((prev) => ({ ...prev, isOpen: prop }));
	};

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
					: !values.showConfirmPassword,
		});
	};

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
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
			setAlert({
				message: "Password does not match!",
				isOpen: true,
			});
			setIsLoading(false);
			return;
		}
		if (password !== confirm_password) {
			setIsError({
				email: false,
				password: true,
				confirmPassword: true,
			});
			setAlert({
				message: "Password does not match.",
				isOpen: true,
			});
			setIsLoading(false);
			return;
		}
		try {
			await signUp(email, password);
		} catch (error: any) {
			setAlert({
				message: VerifyFirebaseErrorCode(error.code),
				isOpen: true,
			});
			setIsLoading(false);
		}
	};

	const signInWithPopup = async () => {
		setIsLoading(true);
		try {
			await signInWithGooglePopup();
			setIsLoading(false);
			navigate("/", { replace: true });
		} catch (error: any) {
			setAlert({
				message: VerifyFirebaseErrorCode(error.code),
				isOpen: true,
			});
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
						paddingTop: "80px",
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
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
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
							onClick={handleSubmit}
						>
							Sign Up
						</Button>
						{Capacitor.getPlatform() === "web" && (
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
						)}
						<Grid container>
							<Grid item sx={{ mt: 2 }}>
								<Link href="/login" variant="body2">
									{"Already have an account? Sign In"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
			<CustomSnackbar
				alertType="error"
				message={alert.message}
				open={alert.isOpen}
				setOpen={handleSnackbarToggle}
				autoHideDuration={6000}
				anchorPosition={{
					vertical: "top",
					horizontal: "right",
				}}
				margin={"3rem 0 0.5rem 0"}
			/>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={isLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
