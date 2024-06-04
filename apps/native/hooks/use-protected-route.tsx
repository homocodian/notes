import React from "react";

import { router, useRootNavigationState, useSegments } from "expo-router";

import { User } from "@/lib/validations/user";

// This hook will protect the route access based on user authentication.
export function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, segments, navigationState]);
}
