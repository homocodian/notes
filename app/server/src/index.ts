import { Elysia } from "elysia";
import { db } from "./db";
const app = new Elysia()
	.decorate("db", db)
	.get("/", () => {
		return "Hello Elysia";
	})
	.listen(process.env.PORT || 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
