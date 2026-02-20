import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // TODO: Conectar con Contexto de Autenticación real o Store de Zustand
  // Por ahora, simulamos que siempre está logueado (true).
  // Cambia esto a `false` para probar la redirección al login.
  const isAuthenticated = true;

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza las rutas hijas
  return <Outlet />;
}
