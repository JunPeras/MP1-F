import { useNavigate } from "react-router-dom";

export function EmptyState() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">

      <div className="text-4xl mb-3">
        📋
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        No tienes tareas aún
      </h2>

      <p className="mt-2 text-sm text-gray-600 max-w-sm">
        Empieza creando una actividad evaluativa y dividiéndola en subtareas
        para planificar tu trabajo.
      </p>

      <button
        onClick={() => navigate("/crear")}
        className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Crear actividad
      </button>

    </div>
  );
}