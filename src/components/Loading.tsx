import { useEffect, useRef } from "react";

import lottie from "lottie-web";

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
		<div className="container">
			<div className="animation-container" ref={animationContainer} />
		</div>
	);
}

export default Loading;
