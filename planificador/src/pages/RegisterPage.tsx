import { useForm } from 'react-hook-form';
import { register as registerUser } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

interface RegisterForm {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  daily_hour_limit: number;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      navigate('/login');
    } catch (err:any) {

  if (err.response?.data) {

    const errors = err.response.data;

    const firstError = Object.values(errors)[0];

    if (Array.isArray(firstError)) {
      setError(firstError[0]);
    } else {
      setError("Error al registrarse");
    }

  } else {
    setError("No se pudo crear la cuenta");
  }
    }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md border">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Crear cuenta
          </h1>
          <p className="text-sm text-gray-500">
            Regístrate para comenzar a planificar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            placeholder="Usuario"
            {...register('username')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            placeholder="Email"
            {...register('email')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            placeholder="Nombre"
            {...register('first_name')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            placeholder="Apellido"
            {...register('last_name')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            {...register('password')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            {...register('password_confirm')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Horas disponibles al día"
            {...register('daily_hour_limit')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Registrarse
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">

          <p>
            ¿Ya tienes cuenta?
          </p>

          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Volver al login
          </Link>

        </div>

      </div>

    </div>
  );
}