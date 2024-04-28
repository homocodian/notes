import Elysia, { t } from "elysia";

import { db } from "@/db";

export const notesRoute = new Elysia({ prefix: "/notes" }).decorate("db", db);
