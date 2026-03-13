import { useTodayTasks } from "../hooks/useTodayTasks";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getActivityById } from "../services/activity.service";

export default function HoyPage() {

  const { data, isLoading, isError } = useTodayTasks();
  const [activitiesInfo, setActivitiesInfo] = useState<Record<number, any>>({});

  useEffect(() => {
    if (data?.groups) {
      const allTasks = [
        ...data.groups.overdue.tasks,
        ...data.groups.today.tasks,
        ...data.groups.coming_up.tasks
    ];

      const uniqueActivityIds = Array.from(new Set(allTasks.map(t => t.activity)));

      uniqueActivityIds.forEach(async (id) => {
        if (!activitiesInfo[id]) { // Si no la tenemos ya cargada
          try {
            const activityData = await getActivityById(id);
            setActivitiesInfo(prev => ({ ...prev, [id]: activityData }));
          } catch (err) {
            console.error(`Error cargando actividad ${id}`, err);
          }
        }
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Cargando tareas...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">

        <h2 className="text-lg font-semibold text-red-600">
          Error al cargar las tareas
        </h2>

        <p className="text-gray-500 mt-2 mb-4">
          Intenta recargar la página.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Reintentar
        </button>

      </div>
    );
  }

  if (!data || !data.groups) {
    return <p>No hay datos disponibles.</p>;
  }

  if (data.total_count === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">

        <div className="text-4xl mb-4">📋</div>

        <h2 className="text-xl font-semibold text-gray-800">
          Aún no tienes tareas
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Empieza creando tu primera actividad
        </p>

        <Link
          to="/crear"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Crear actividad
        </Link>

      </div>
    );
  }

  const overdue = data.groups.overdue.tasks;
  const today = data.groups.today.tasks;
  const upcoming = data.groups.coming_up.tasks;

  return (
    <div className="space-y-8">
      
      <header className="space-y-2">
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

          {overdue.map((task:any) => { 
            const activity = activitiesInfo[task.activity];
              return (
                <Link
                  key={task.id}
                  to={`/actividad/${task.activity}`}
                  className="block rounded-lg border border-red-200 bg-red-50 p-3 transition hover:bg-red-100 hover:shadow-sm active:scale-[0.98]"
                >
                  
                  <p className="font-medium">
                    {task.name || "Sin nombre"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {activity ? activity.title : "Cargando actividad"}
                  </p>

                  <p className="text-sm text-gray-500">
                    ⏱ {task.estimated_hours} horas
                  </p>

                  <p className="text-sm text-gray-600 font-medium">
                    Fecha límite: {task.target_date || "Sin fecha"} 
                  </p>
                </Link>
          );
        })}

        </div>
      </section>

      {/* PARA HOY */}
      <section>
        <h2 className="text-lg font-semibold text-blue-600">
          Para hoy
        </h2>

        <div className="mt-3 space-y-2">

          {today.map((task:any) => { 
            const activity = activitiesInfo[task.activity];
              return (
                <Link
                  key={task.id}
                  to={`/actividad/${task.activity}`}
                  className="block rounded-lg border border-blue-200 bg-blue-50 p-3 transition hover:bg-blue-100 hover:shadow-sm active:scale-[0.98]"
                >
                  
                  <p className="font-medium">
                    {task.name || "Sin nombre"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {activity ? activity.title : "Cargando actividad"}
                  </p>

                  <p className="text-sm text-gray-500">
                    ⏱ {task.estimated_hours} horas
                  </p>

                  <p className="text-sm text-gray-600 font-medium">
                    Fecha límite: {task.target_date || "Sin fecha"} 
                  </p>
                </Link>
          );
        })}

        </div>
      </section>

      {/* PRÓXIMAS */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800">
          Próximas
        </h2>

        <div className="mt-3 space-y-2">

          {upcoming.map((task:any) => { 
            const activity = activitiesInfo[task.activity];
              return (
                <Link
                  key={task.id}
                  to={`/actividad/${task.activity}`}
                  className="block rounded-lg border border-gray-200 bg-white p-3 transition hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
                >
                  
                  <p className="font-medium">
                    {task.name || "Sin nombre"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {activity ? activity.title : "Cargando actividad"}
                  </p>

                  <p className="text-sm text-gray-500">
                    ⏱ {task.estimated_hours} horas
                  </p>

                  <p className="text-sm text-gray-600 font-medium">
                    Fecha límite: {task.target_date || "Sin fecha"} 
                  </p>
                </Link>
          );
        })}

        </div>
      </section>

    </div>
  );
}