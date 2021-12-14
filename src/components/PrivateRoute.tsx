import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext" 

type PrivateRouteProps = {
  children: React.ReactNode
}

function PrivateRoute({children}:PrivateRouteProps) {
  const {user} = useAuth()
  return user ? children : <Navigate to="/login"/>
}

export default PrivateRoute
