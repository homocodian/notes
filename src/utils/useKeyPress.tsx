import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

export default function useKeyPress(
	keys: string[],
	callback: () => void,
	node = null
) {
	// implement the callback ref pattern
	const callbackRef = useRef(callback);

	useLayoutEffect(() => {
		callbackRef.current = callback;
	}, []);

	// handle what happens on key press
	const handleKeyPress = useCallback((event: KeyboardEvent) => {
		if (keys.some((key) => key === event.key)) {
			callbackRef.current();
		}
	}, []);

	useEffect(() => {
		// target is either the provided node or the document
		const targetNode = node ?? document;
		// attach the event listener
		targetNode && targetNode.addEventListener("keydown", handleKeyPress);
		targetNode && targetNode.addEventListener("keyup", handleKeyPress);
		targetNode && targetNode.addEventListener("keypress", handleKeyPress);

		// remove the event listener
		return () => {
			targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
			targetNode && targetNode.removeEventListener("keypress", handleKeyPress);
			targetNode && targetNode.removeEventListener("keyup", handleKeyPress);
		};
	}, [handleKeyPress, node]);
}
