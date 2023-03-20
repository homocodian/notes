import { Clipboard } from "@capacitor/clipboard";

export const writeToClipboard = async (text: string) => {
	try {
		await Clipboard.write({
			string: text,
		});
		return text;
	} catch (error) {
		return undefined;
	}
};

export const checkClipboard = async () => {
	try {
		const { type, value } = await Clipboard.read();
		console.log(`Got ${type} from clipboard: ${value}`);
		return {
			type,
			value,
		};
	} catch (error) {
		return undefined;
	}
};
