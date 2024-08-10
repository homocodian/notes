import React from "react";

import { debounceTime, filter, skip } from "rxjs/operators";

import { useAuth } from "@/context/auth";
import { APIError } from "@/lib/api-error";
import { database } from "@/lib/db";
import { Table } from "@/lib/db/model/schema";
import { syncChanges } from "@/lib/db/sync";
import { retryOnce } from "@/lib/retry-once";
import { useSyncStore } from "@/lib/store/sync";
import { useUserStore } from "@/lib/store/user";
import { toast } from "@/lib/toast";

export async function sync(signOut: ReturnType<typeof useAuth>["signOut"]) {
  const user = useUserStore.getState().user;
  const setSyncing = useSyncStore.getState().setSyncing;
  const isSyncing = useSyncStore.getState().isSyncing;

  if (user && !isSyncing) {
    setSyncing(true);
    try {
      await retryOnce(syncChanges);
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.error("Failed to sync data after retrying once:", error);
      }
      toast("Sync failed. Please log in again", {
        android: { duration: "LONG" }
      });
      if (
        error instanceof APIError &&
        error.status === 401 &&
        error.url.includes("/sync/pull")
      ) {
        signOut();
      }
    } finally {
      setSyncing(false);
    }
  } else {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("No user or already syncing, skipping...");
    }
  }
}

export function useSync() {
  const { signOut } = useAuth();

  React.useEffect(() => {
    sync(signOut);
  }, [signOut]);

  React.useEffect(() => {
    const unsub = database
      .withChangesForTables([Table.note.name])
      .pipe(
        skip(1),
        filter((changes) => {
          return (
            changes?.some((change) => {
              // Check if the record is not simply becoming `synced`
              const notJustSynced = change.record.syncStatus !== "synced";
              // Check if the record is not an `updated` record with `deleted_at` in changes
              const notUpdatedDeletedAt = !(
                change.record?.syncStatus === "updated" &&
                change.record?._raw?._changed?.includes("deleted_at")
              );
              // Return true if either condition is met
              return notJustSynced && notUpdatedDeletedAt;
            }) ?? true
          );
        }),
        // debounce to avoid syncing in the middle of related actions
        debounceTime(500)
      )
      .subscribe(() => sync(signOut));

    return () => unsub.unsubscribe();
  }, []);
}
