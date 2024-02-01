import { Network } from "@capacitor/network";

export async function networkAware(cb: () => void) {
  const state = await Network.getStatus();
  if (!state.connected) {
    throw new Error("Check your network connection");
  }
  cb();
}
