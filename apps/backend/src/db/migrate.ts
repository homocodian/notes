import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(sql);

async function main() {
	try {
		console.log("Migrating....");
		await migrate(db, { migrationsFolder: import.meta.dir + "./migrations" });
		await sql.end();
		console.log("Migration done.");
	} catch (error) {
		console.log("🚀 ~ main ~ error:", error);
	}
}

main();
