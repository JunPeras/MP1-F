import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import { Modal } from './Modal';
import { useUpdateActivity } from '../../hooks/useUpdateActivity';
import {
  updateActivitySchema,
  type UpdateActivityForm,
  type Activity,
} from '../../schemas/activity.schema';
import { ACTIVITY_TYPES, ACTIVITY_TYPE_LABEL } from '../../constants';

interface EditActivityModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly activity: Activity;
}

/**
 * Modal con formulario para editar los campos de una actividad existente.
 * Precarga los valores actuales y envía un PATCH al guardar.
 */
export function EditActivityModal({
  isOpen,
  onClose,
  activity,
}: EditActivityModalProps) {
  const updateMutation = useUpdateActivity(activity.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateActivityForm>({
    resolver: zodResolver(updateActivitySchema),
    defaultValues: formDefaults(activity),
  });

  // Resetear el formulario cuando cambia la actividad o se abre el modal
  useEffect(() => {
    if (isOpen) {
      reset(formDefaults(activity));
    }
  }, [isOpen, activity, reset]);

  const onSubmit = (data: UpdateActivityForm) => {
    updateMutation.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar actividad"
      className="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-activity-form"
            disabled={updateMutation.isPending || !isDirty}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar cambios
          </button>
        </>
      }
    >
      <form
        id="edit-activity-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Título */}
        <div>
          <label
            htmlFor="edit-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Título
          </label>
          <input
            id="edit-title"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label
            htmlFor="edit-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de actividad
          </label>
          <select
            id="edit-type"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            {...register('type')}
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {ACTIVITY_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* Curso */}
        <div>
          <label
            htmlFor="edit-course"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Curso
          </label>
          <input
            id="edit-course"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            {...register('course')}
          />
          {errors.course && (
            <p className="mt-1 text-xs text-red-600">
              {errors.course.message}
            </p>
          )}
        </div>

        {/* Fechas */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="edit-event-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha del evento{' '}
              <span className="text-gray-400 font-normal"> (opcional)</span>
            </label>
            <input
              id="edit-event-date"
              type="datetime-local"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('event_date')}
            />
            {errors.event_date && (
              <p className="mt-1 text-xs text-red-600">
                {errors.event_date.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="edit-due-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha límite
            </label>
            <input
              id="edit-due-date"
              type="datetime-local"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('due_date')}
            />
            {errors.due_date && (
              <p className="mt-1 text-xs text-red-600">
                {errors.due_date.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

// ── Helper para obtener defaultValues del formulario ──

function formDefaults(activity: Activity): UpdateActivityForm {
  return {
    title: activity.title,
    type: activity.type,
    course: activity.course,
    due_date: activity.due_date?.slice(0, 16) ?? '',
    event_date: activity.event_date?.slice(0, 16) ?? '',
  };
}
