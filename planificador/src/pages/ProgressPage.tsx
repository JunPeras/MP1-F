import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Loader2, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';

import { useProgressActivities } from '../hooks/useProgressActivities';
import { formatFriendlyDate } from '../utils/dateUtils';

export default function ProgressPage() {
  const { data = [], isLoading, isError } = useProgressActivities();

  const sortedActivities = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          new Date(b.due_date ?? '').getTime() - new Date(a.due_date ?? '').getTime(),
      ),
    [data],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando progreso...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          No se pudo cargar el progreso
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Intenta recargar la página para consultar de nuevo.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (sortedActivities.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <div className="text-4xl">📈</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Mi progreso</h1>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Aún no hay actividades para mostrar. Crea una actividad para empezar a
          medir tu avance.
        </p>
        <Link
          to="/crear"
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Crear actividad
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mi progreso</h1>
        <p className="mt-1 text-sm text-gray-600">
          Revisa el avance de tus actividades, ordenadas por fecha límite.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sortedActivities.map((activity) => (
          <article
            key={activity.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-900">
                  {activity.title || 'Actividad sin título'}
                </h2>
                <p className="text-sm text-blue-700">{activity.course || 'Curso no definido'}</p>
              </div>
              <Link
                to={`/actividad/${activity.id}`}
                className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                Ver detalle
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mb-4 space-y-1.5 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                <span>
                  <strong className="font-semibold text-gray-800">Fecha del Evento:</strong>{' '}
                  {formatFriendlyDate(activity.due_date)}
                </span>
              </p>

              {activity.event_date && (
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>
                    <strong className="font-semibold text-gray-800">Fecha Limite:</strong>{' '}
                    {formatFriendlyDate(activity.event_date)}
                  </span>
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                <span>{activity.progress_percentage}%</span>
                <span>
                  {activity.completed_subtasks}/{activity.total_subtasks} completadas
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${activity.progress_percentage}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
