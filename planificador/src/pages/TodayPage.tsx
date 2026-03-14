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
    <div className="h-[calc(100vh-120px)] flex flex-col">
      
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">
          Tu día: Hoy
        </h1>
        <p className="text-sm text-gray-600">
          {data.summary}
        </p>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* VENCIDAS */}
        <section className="flex flex-col min-h-0 bg-gray-50/50 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Vencidas ({overdue.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {overdue.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No hay tareas vencidas</p>
            ) : (
              overdue.map((task: any) => {
                const activity = activitiesInfo[task.activity];
                return (
                  <Link
                    key={task.id}
                    to={`/actividad/${task.activity}`}
                    className="block rounded-lg border border-red-100 bg-white p-3 shadow-sm transition hover:border-red-300 hover:shadow-md active:scale-[0.98]"
                  >
                    <p className="font-semibold text-gray-900 leading-tight mb-1">
                      {task.name || "Sin nombre"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-blue-600 truncate">
                        {activity ? activity.title : "Cargando..."}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-1 border-t border-gray-50">
                        <span>⏱ {task.estimated_hours}h</span>
                        <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          {task.target_date}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* PARA HOY */}
        <section className="flex flex-col min-h-0 bg-blue-50/30 rounded-xl border border-blue-100 p-4">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Para hoy ({today.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {today.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">Todo listo por hoy</p>
            ) : (
              today.map((task: any) => {
                const activity = activitiesInfo[task.activity];
                return (
                  <Link
                    key={task.id}
                    to={`/actividad/${task.activity}`}
                    className="block rounded-lg border border-blue-100 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md active:scale-[0.98]"
                  >
                    <p className="font-semibold text-gray-900 leading-tight mb-1">
                      {task.name || "Sin nombre"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-blue-600 truncate">
                        {activity ? activity.title : "Cargando..."}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-1 border-t border-gray-50">
                        <span>⏱ {task.estimated_hours}h</span>
                        <span className="text-blue-600">Hoy</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* PRÓXIMAS */}
        <section className="flex flex-col min-h-0 bg-gray-50/50 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Próximas ({upcoming.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No hay tareas próximas</p>
            ) : (
              upcoming.map((task: any) => {
                const activity = activitiesInfo[task.activity];
                return (
                  <Link
                    key={task.id}
                    to={`/actividad/${task.activity}`}
                    className="block rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md active:scale-[0.98]"
                  >
                    <p className="font-semibold text-gray-900 leading-tight mb-1">
                      {task.name || "Sin nombre"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-blue-600 truncate">
                        {activity ? activity.title : "Cargando..."}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-1 border-t border-gray-50">
                        <span>⏱ {task.estimated_hours}h</span>
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">
                          {task.target_date}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}