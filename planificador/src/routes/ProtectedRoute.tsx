import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {

  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}