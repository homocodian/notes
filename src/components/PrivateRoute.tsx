import { useAuthStore } from "@/store/auth";
import { Fragment, useEffect } from "react";

import { useNavigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  return <Fragment>{children}</Fragment>;
}

export default PrivateRoute;
