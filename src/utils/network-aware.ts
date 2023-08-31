import { Network } from "@capacitor/network";

export async function networkAware(cb: Function) {
	const state = await Network.getStatus();
	if (!state.connected) {
		throw new Error("Check your network connection");
	}
	cb();
}
