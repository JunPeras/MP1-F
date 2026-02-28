import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import { Modal } from './Modal';
import { useUpdateSubtask } from '../../hooks/useSubtaskMutations';
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateSubtaskForm>({
    resolver: zodResolver(updateSubtaskSchema),
    defaultValues: subtask ? formDefaults(subtask) : undefined,
  });

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
            disabled={updateMutation.isPending || !isDirty}
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
