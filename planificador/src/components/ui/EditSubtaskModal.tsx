import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, Save } from 'lucide-react';

import { Modal } from './Modal';
import { useUpdateSubtask } from '../../hooks/useSubtaskMutations';
import { useAllSubtasks } from '../../hooks/useSubtask';

import {
  updateSubtaskSchema,
  type UpdateSubtaskForm,
  type Subtask,
} from '../../schemas/subtask.schema';

interface EditSubtaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly subtask: Subtask | null;
  readonly activityId: number;
  readonly allSubtasks: Subtask[];
}

/**
 * Modal con formulario para editar los campos de una subtarea existente.
 * Precarga nombre, fecha objetivo y horas estimadas.
 */
export function EditSubtaskModal({
  isOpen,
  onClose,
  subtask,
  activityId,
}: EditSubtaskModalProps) {
  const updateMutation = useUpdateSubtask(activityId);

  const { data: allUserSubtasks = [] } = useAllSubtasks();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateSubtaskForm>({
    resolver: zodResolver(updateSubtaskSchema),
    defaultValues: subtask ? formDefaults(subtask) : undefined,
  });

  const currentFormDate = useWatch({ control, name: 'target_date' });
  const currentFormHours = useWatch({ control, name: 'estimated_hours' });

  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  const limit = user?.daily_hour_limit ?? 6; // Usamos el límite de la BD, si no existe, 6 por defecto

  const existingHoursForDate = allUserSubtasks
    .filter((s: { target_date: string; id: number | undefined; }) => s.target_date === currentFormDate && s.id !== subtask?.id)
    .reduce((sum: number, s: Subtask) => sum + Number(s.estimated_hours), 0);

  const totalHours = existingHoursForDate + (Number(currentFormHours) || 0);
  const hasExceeded = totalHours > limit;
  
  // Resetear el formulario cuando cambia la subtarea o se abre el modal
  useEffect(() => {
    if (isOpen && subtask) {
      reset(formDefaults(subtask));
    }
  }, [isOpen, subtask, reset]);

  const onSubmit = (data: UpdateSubtaskForm) => {
    if (!subtask) return;

    updateMutation.mutate(
      { id: subtask.id, data },
      { onSuccess: () => onClose() },
    );
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar subtarea"
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
            form="edit-subtask-form"
            disabled={updateMutation.isPending || !isDirty || hasExceeded}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar
          </button>
        </>
      }
    >
      <form
        id="edit-subtask-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Nombre */}
        <div>
          <label
            htmlFor="edit-subtask-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            id="edit-subtask-name"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Fecha objetivo + Horas */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="edit-subtask-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha objetivo
            </label>
            <input
              id="edit-subtask-date"
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('target_date')}
            />
            {errors.target_date && (
              <p className="mt-1 text-xs text-red-600">
                {errors.target_date.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="edit-subtask-hours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Horas estimadas
            </label>
            <input
              id="edit-subtask-hours"
              type="number"
              step="0.5"
              min="0.1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('estimated_hours', { valueAsNumber: true })}
            />
            {errors.estimated_hours && (
              <p className="mt-1 text-xs text-red-600">
                {errors.estimated_hours.message}
              </p>
            )}
          </div>
        </div>

        {hasExceeded && (
          <div className="mt-4 flex gap-3 rounded-md bg-red-50 p-3 border border-red-100">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800">
              <p className="font-bold uppercase mb-1">
                Límite de horas excedido
              </p>
              <p>
                Has superado el límite de <strong>{limit} horas</strong> disponibles. 
                Por favor, ajusta los tiempos para no sobrecargarte
              </p>
            </div>
          </div>
        )}

      </form>
    </Modal>
  );
}

// ── Helper para obtener defaultValues del formulario ──

function formDefaults(subtask: Subtask): UpdateSubtaskForm {
  return {
    name: subtask.name,
    target_date: subtask.target_date,
    estimated_hours: Number(subtask.estimated_hours),
  };
}
