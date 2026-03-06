import { useTodayTasks } from "../hooks/useTodayTasks";

export default function HoyPage() {

  const { data, isLoading, isError } = useTodayTasks();

  if (isLoading) {
    return <p>Cargando tareas...</p>;
  }

  if (isError) {
    return <p>Error cargando las tareas.</p>;
  }

  if (!data || !data.groups) {
    return <p>No hay datos disponibles.</p>;
  }

  if (data.total_count === 0) {
    return <p>No tienes tareas aún.</p>;
  }

  const overdue = data.groups.overdue.tasks;
  const today = data.groups.today.tasks;
  const upcoming = data.groups.coming_up.tasks;

  return (
    <div className="space-y-8">

      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Tu día: Hoy
        </h1>

        <p className="text-sm text-gray-600">
          {data.summary}
        </p>
      </header>

      {/* VENCIDAS */}
      <section>
        <h2 className="text-lg font-semibold text-red-600">
          Vencidas
        </h2>

        <div className="mt-3 space-y-2">

          {overdue.map((task:any) => (
            <div
              key={task.id}
              className="rounded-lg border border-red-200 bg-red-50 p-3"
            >
              <p className="font-medium">
                {task.name || "Sin nombre"}
              </p>

              <p className="text-sm text-gray-500">
                ⏱ {task.estimated_hours} horas
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* PARA HOY */}
      <section>
        <h2 className="text-lg font-semibold text-blue-600">
          Para hoy
        </h2>

        <div className="mt-3 space-y-2">

          {today.map((task:any) => (
            <div
              key={task.id}
              className="rounded-lg border border-blue-200 bg-blue-50 p-3"
            >
              <p className="font-medium">
                {task.name || "Sin nombre"}
              </p>

              <p className="text-sm text-gray-500">
                ⏱ {task.estimated_hours} horas
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* PRÓXIMAS */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800">
          Próximas
        </h2>

        <div className="mt-3 space-y-2">

          {upcoming.map((task:any) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              <p className="font-medium">
                {task.name || "Sin nombre"}
              </p>

              <p className="text-sm text-gray-500">
                ⏱ {task.estimated_hours} horas
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}