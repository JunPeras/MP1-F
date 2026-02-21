import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Páginas
import {
  LoginPage,
  HoyPage,
  CrearActividadPage,
  DetalleActividadPage,
  ProgresoPage,
} from '../pages';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (Solo accesibles si NO estás autenticado) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/hoy" element={<HoyPage />} />
            <Route path="/crear" element={<CrearActividadPage />} />
            <Route path="/actividad/:id" element={<DetalleActividadPage />} />
            <Route path="/progreso" element={<ProgresoPage />} />

            {/* Ruta por defecto para usuarios autenticados */}
            <Route path="/" element={<Navigate to="/hoy" replace />} />
          </Route>
        </Route>

        {/* Ruta por defecto para usuarios no autenticados */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
