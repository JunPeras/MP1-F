import { useForm } from "react-hook-form";
import { register as registerUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterForm) => {

    try {

      await registerUser(data);

      navigate("/login");

    } catch (err:any) {

      setError("Error al registrarse");

    }

  };

  return (
    <div className="mx-auto max-w-sm">

      <h1 className="mb-6 text-2xl font-bold">
        Crear cuenta
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          placeholder="Usuario"
          {...register("username")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          placeholder="Email"
          {...register("email")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          placeholder="Nombre"
          {...register("first_name")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          placeholder="Apellido"
          {...register("last_name")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          {...register("password_confirm")}
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          type="number"
          placeholder="Horas disponibles al día"
          {...register("daily_hour_limit")}
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
          Registrarse
        </button>

      </form>

    </div>
  );
}