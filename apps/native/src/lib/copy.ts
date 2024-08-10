import { setStringAsync } from "expo-clipboard";

export async function copyString(value: string) {
  return await setStringAsync(value);
}
