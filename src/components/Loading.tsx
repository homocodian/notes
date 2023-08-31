import { useEffect, useRef } from "react";

import lottie from "lottie-web";
import { Box } from "@mui/material";

function Loading() {
	const animationContainer = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (animationContainer.current) {
			lottie
				.loadAnimation({
					container: animationContainer.current,
					// @ts-ignore
					animationData: require("../animation/loading.json"),
					autoplay: true,
					loop: true,
					renderer: "svg",
				})
				.play();
		}
	}, []);

	return (
		<Box
			sx={{
				display: "grid",
				placeItems: "center",
				width: "100%",
				height: "100vh",
				background: "#000000",
				position: "absolute",
				inset: 0,
				paddingTop: "64px",
			}}
		>
			<Box
				sx={{
					maxWidth: "512px",
				}}
				ref={animationContainer}
			/>
		</Box>
	);
}

export default Loading;
