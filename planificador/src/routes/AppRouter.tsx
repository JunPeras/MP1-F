import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Páginas
import {
  LoginPage,
  RegisterPage,
  TodayPage,
  CreateActivityPage,
  DetailActivityPage,
  ProgressPage,
} from '../pages';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Rutas públicas (Solo accesibles si NO estás autenticado) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/hoy" element={<TodayPage />} />
            <Route path="/crear" element={<CreateActivityPage />} />
            <Route path="/actividad/:id" element={<DetailActivityPage />} />
            <Route path="/progreso" element={<ProgressPage />} />

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
