import { useForm } from "react-hook-form";
import { login } from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {

  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const onSubmit = async (data: LoginForm) => {

    try {

      await login(data.username, data.password);

      navigate("/hoy");

    } catch (err:any) {

      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Ocurrió un error al iniciar sesión");
      }

    }

  };

  return (
    <div className="mx-auto max-w-sm">

      <h1 className="mb-6 text-2xl font-bold">
        Iniciar sesión
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          type="text"
          placeholder="Usuario"
          {...register("username")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
          className="w-full rounded-md border px-3 py-2"
        />

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Iniciar sesión
        </button>

        <p className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link 
            to="/register" 
            className="text-blue-600 hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>


      </form>

    </div>
  );
}