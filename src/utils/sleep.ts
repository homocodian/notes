export async function sleep(ms = 5000) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
