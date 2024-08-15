import loadable from "@loadable/component";

import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import PrivateRoute from "@/components/PrivateRoute";

const HomePage = loadable(() => import("@/pages/Home"));
const SignInPage = loadable(() => import("@/pages/SignIn"));
const SignUpPage = loadable(() => import("@/pages/SignUp"));
const SharedPage = loadable(() => import("@/pages/Shared"));
const GeneralPage = loadable(() => import("@/pages/General"));
const ImportantPage = loadable(() => import("@/pages/Important"));
const PasswordResetPage = loadable(() => import("@/pages/PasswordReset"));
const ConfirmEmailPage = loadable(() => import("@/pages/ConfirmEmail"));
const AuthRedirectPage = loadable(() => import("@/pages/AuthRedirect"));

export const RouteComponents = [
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <HomePage fallback={<Loading />} />
      </PrivateRoute>
    )
  },
  {
    path: "/general",
    element: (
      <PrivateRoute>
        <GeneralPage fallback={<Loading />} />
      </PrivateRoute>
    )
  },
  {
    path: "/important",
    element: (
      <PrivateRoute>
        <ImportantPage fallback={<Loading />} />
      </PrivateRoute>
    )
  },
  {
    path: "/shared",
    element: (
      <PrivateRoute>
        <SharedPage fallback={<Loading />} />
      </PrivateRoute>
    )
  },
  {
    path: "/login",
    element: <SignInPage fallback={<Loading />} />
  },
  {
    path: "/reset-password/:token",
    element: <PasswordResetPage fallback={<Loading />} />
  },
  { path: "/signup", element: <SignUpPage fallback={<Loading />} /> },
  {
    path: "/verify",
    element: (
      <PrivateRoute>
        <ConfirmEmailPage fallback={<Loading />} />
      </PrivateRoute>
    )
  },
  {
    path: "/login/:provider/callback",
    element: <AuthRedirectPage fallback={<Loading />} />
  }
] as const;

type ExcludeWildcardPath<T> = T extends "*" ? never : T;

export type Route = (typeof RouteComponents)[number]; // Get the type of a single route object

export type RouteName = ExcludeWildcardPath<Route["path"]>; // Get the type of the 'path' property

export const routeNames = RouteComponents.map((route) => route.path).filter(
  (path) => path !== "*"
) as RouteName[number][];
