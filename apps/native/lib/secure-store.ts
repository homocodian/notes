import * as SecureStore from "expo-secure-store";

export async function setSecureValue(key: string, value: string) {
	try {
		await SecureStore.setItemAsync(key, value);
		return true;
	} catch (error) {
		return false;
	}
}

export async function getSecureValue(key: string) {
	try {
		const result = await SecureStore.getItemAsync(key);
		if (result) {
			return result;
		}
	} catch (error) {
		return undefined;
	}
}

export async function deleteSecureValue(key: string) {
	try {
		await SecureStore.deleteItemAsync(key);
		return true;
	} catch (error) {
		return false;
	}
}
