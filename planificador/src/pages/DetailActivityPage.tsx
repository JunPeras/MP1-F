import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';

import { useActivityDetail } from '../hooks/useActivityDetail';
import { useDeleteActivity } from '../hooks/useDeleteActivity';
import { ACTIVITY_TYPE_LABEL } from '../constants';
import { formatFriendlyDate } from '../utils/dateUtils';
import { Modal } from '../components/ui/Modal';
import { EditActivityModal } from '../components/ui/EditActivityModal';
import { SubtaskSection } from '../components/ui/SubtaskSection';

export default function DetailActivityPage() {
  const { id } = useParams();
  const activityId = Number(id);

  const { data: activity, isLoading, isError, error } = useActivityDetail(activityId);
  const deleteActivityMutation = useDeleteActivity();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ── Estados de carga / error ──

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-5 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-64 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="px-6 divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 py-4">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="px-6 py-8 bg-gray-50/50 space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
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
            ? 'Esta actividad no existe o fue eliminada.'
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

  const typeLabel = ACTIVITY_TYPE_LABEL[activity.type] ?? activity.type;

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
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header con Estado */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Detalles de la Actividad
            </span>
            <h1 className="text-xl font-bold text-gray-900 truncate mt-0.5">
              {activity.title}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium border",
              activity.status === 'pending'
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-green-50 text-green-700 border-green-200"
            )}>
              {activity.status === 'pending' ? 'Pendiente' : 'Completada'}
            </span>
            <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="divide-y divide-gray-100 px-6">
          <DetailRow
            icon={<BookOpen className="h-4 w-4 text-gray-400" />}
            label="Curso"
            value={activity.course}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4 text-gray-400" />}
            label="Fecha límite"
            value={formatFriendlyDate(activity.due_date, true)}
          />
          {activity.event_date && (
            <DetailRow
              icon={<Clock className="h-4 w-4 text-gray-400" />}
              label="Fecha del evento"
              value={formatFriendlyDate(activity.event_date, true)}
            />
          )}
          <DetailRow
            icon={<FileText className="h-4 w-4 text-gray-400" />}
            label="Creada el"
            value={formatFriendlyDate(activity.created_at, true)}
          />
        </div>

        {/* ── Plan de Trabajo (Subtareas) ── */}
        <SubtaskSection
          activityId={activityId}
          subtasks={activity.subtasks ?? []}
        />

        {/* ── Acciones ── */}
        <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Editar actividad
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar actividad
          </button>
        </div>
      </div>

      {/* Modal de edición de actividad */}
      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activity={activity}
      />

      {/* Modal de confirmación para eliminar actividad */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="¿Eliminar esta actividad?"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => deleteActivityMutation.mutate(activityId)}
              disabled={deleteActivityMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteActivityMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Se eliminarán también todas las subtareas asociadas. Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}

// ── Helpers locales ──

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface DetailRowProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="shrink-0">{icon}</div>
      <span className="text-sm text-gray-500 w-32 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
