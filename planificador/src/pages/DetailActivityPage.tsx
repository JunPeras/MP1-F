import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

import { useActivityDetail } from '../hooks/useActivityDetail';
import { ACTIVITY_TYPE_LABEL } from '../constants';
import type { ActivityType } from '../constants';

export default function DetailActivityPage() {
  const { id } = useParams();
  const activityId = Number(id);

  const { data: activity, isLoading, isError, error } = useActivityDetail(activityId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-3 text-sm">Cargando actividad…</p>
      </div>
    );
  }

  if (isError) {
    const is404 =
      error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { status?: number } }).response?.status === 404
        : false;

    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {is404 ? 'Actividad no encontrada' : 'Error al cargar la actividad'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {is404
            ? 'La actividad que buscas no existe o fue eliminada.'
            : 'Ocurrió un error al consultar el servidor. Intenta de nuevo.'}
        </p>
        <Link
          to="/hoy"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!activity) return null;

  const typeLabel =
    ACTIVITY_TYPE_LABEL[activity.type as ActivityType] ?? activity.type;

  const formattedDueDate = new Date(activity.due_date + 'T00:00:00').toLocaleDateString(
    'es-CO',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );

  const formattedCreatedAt = new Date(activity.created_at + 'T00:00:00').toLocaleDateString(
    'es-CO',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        to="/hoy"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      {/* Main card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {activity.title}
              </h1>
              <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="divide-y divide-gray-100 px-6">
          <DetailRow
            icon={<BookOpen className="h-4 w-4 text-gray-400" />}
            label="Curso"
            value={activity.course}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4 text-gray-400" />}
            label="Fecha límite"
            value={formattedDueDate}
          />
          <DetailRow
            icon={<Clock className="h-4 w-4 text-gray-400" />}
            label="Creada el"
            value={formattedCreatedAt}
          />
        </div>

        {/* Subtasks placeholder */}
        <div className="px-6 py-5">
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
            <p className="text-sm text-gray-400 text-center">
              El plan de trabajo (subtareas) estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      {icon}
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
