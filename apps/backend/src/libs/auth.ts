import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Google } from "arctic";
import { Lucia } from "lucia";

import { env } from "@/env";

import { db } from "../db";
import { sessionTable, userTable } from "../db/schema/user";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // attributes: {
    //   // set to `true` when using HTTPS
    //   secure: process.env.NODE_ENV === "production"
    // }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      photoURL: attributes.photoURL,
      displayName: attributes.displayName,
      disabled: attributes.disabled
    };
  }
});

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: {
      email: string;
      emailVerified: boolean;
      photoURL: string | null;
      displayName: string | null;
      disabled: boolean;
    };
  }
}
