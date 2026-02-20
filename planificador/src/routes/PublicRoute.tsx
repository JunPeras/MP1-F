import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  // TODO: Conectar con el mismo contexto de autenticación que ProtectedRoute
  const isAuthenticated = true; // Por ahora simulado en true para probar la redirección

  if (isAuthenticated) {
    return <Navigate to="/hoy" replace />;
  }

  return <Outlet />;
}
