import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      navigate('/hoy');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('Ocurrió un error al iniciar sesión');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md border">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500">
            Accede a tu planificador
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            type="text"
            placeholder="Usuario"
            {...register('username')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            {...register('password')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
              </div>
            )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Regístrate
          </Link>
        </p>

      </div>

    </div>
  );
}