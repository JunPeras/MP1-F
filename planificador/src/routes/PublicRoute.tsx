import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {

  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;

  if (isAuthenticated) {
    return <Navigate to="/hoy" replace />;
  }

  return <Outlet />;
}