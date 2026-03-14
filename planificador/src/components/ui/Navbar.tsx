import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Settings } from 'lucide-react';
import { logout } from '../../services/auth.service';
import { useState } from 'react';
import { SettingsModal } from './SettingsModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/hoy', label: 'Hoy' },
  { path: '/crear', label: 'Crear Actividad' },
  { path: '/progreso', label: 'Progreso' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              SlowTrack
            </span>
          </div>

          {/* Navegacion */}
          <div className="flex items-center gap-1 sm:gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 px-3 py-2 rounded-md',
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100/50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Perfil */}
          <div className="flex items-center gap-4">



            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors"
              title="Configuracion"
            >
              <Settings className="h-5 w-5" />
            </button>

            <div className="hidden sm:block text-xs text-gray-500 text-right">
              <p className="font-medium text-gray-900">
                {username || 'Usuario'}
              </p>
              <p>Estudiante</p>
            </div>

            <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer transition-colors hidden sm:block"
            >
              Cerrar sesion
            </button>

          </div>
        </div>
      </nav>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}