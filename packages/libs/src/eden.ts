import { treaty } from "@elysiajs/eden";
import type { App } from "backend";

export const getEdenTreaty = (
	baseUrl: string,
	options: Parameters<typeof treaty<App>>["1"]
) => treaty<App>(baseUrl, options);
