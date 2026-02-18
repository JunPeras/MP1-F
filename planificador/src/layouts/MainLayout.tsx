import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Aquí se renderizarán las páginas hijas */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}