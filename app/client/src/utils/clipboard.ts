import { Clipboard } from "@capacitor/clipboard";

export async function writeToClipboard(text: string) {
  return Clipboard.write({ string: text });
}

export const checkClipboard = async () => {
  try {
    const { type, value } = await Clipboard.read();
    console.log(`Got ${type} from clipboard: ${value}`);
    return {
      type,
      value,
    };
  } catch (error) {
    return null;
  }
};
