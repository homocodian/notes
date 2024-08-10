import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";

import { API } from "../api";
import { collections, database } from "./index";

export async function syncChanges() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const response: { changes: SyncDatabaseChangeSet; timestamp: number } =
        await API.post("/v1/sync/pull", {
          query: {
            ...(lastPulledAt
              ? { last_pulled_at: lastPulledAt?.toString()! }
              : {}),
            schema_version: schemaVersion.toString(),
            ...(migration ? { migration: JSON.stringify(migration) } : {})
          },
          data: collections
        });

      return response;
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      await API.post("/v1/sync/push", {
        query: {
          last_pulled_at: lastPulledAt?.toString()!
        },
        data: changes
      });
    },
    migrationsEnabledAtVersion: 1
  });
}
