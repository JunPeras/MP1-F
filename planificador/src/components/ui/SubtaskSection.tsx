import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Calendar,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from 'lucide-react';

import {
  useCreateSubtask,
  useUpdateSubtaskStatus,
  useDeleteSubtask,
} from '../../hooks/useSubtaskMutations';
import {
  createSubtaskSchema,
  type CreateSubtaskForm,
  type Subtask,
} from '../../schemas/subtask.schema';
import { Modal } from './Modal';
import { EditSubtaskModal } from './EditSubtaskModal';
import { useAllSubtasks } from '../../hooks/useSubtask';
import { useDailyLimitValidation } from '../../hooks/useDailyLimitValidation';

interface SubtaskSectionProps {
  readonly activityId: number;
  readonly subtasks: Subtask[];
  readonly dueDate?: string;
}

function getDateInputMax(dateValue?: string): string | undefined {
  if (!dateValue) return undefined;

  const directMatch = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
  if (directMatch) return directMatch[1];

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return undefined;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sortSubtasks(subtasks: Subtask[]): Subtask[] {
  return [...subtasks].sort((a, b) => {
    const statusOrder: Record<Subtask['status'], number> = {
      pending: 0,
      postponed: 1,
      completed: 2,
    };

    return statusOrder[a.status] - statusOrder[b.status];
  });
}

/**
 * Sección de plan de trabajo para la vista detalle de una actividad.
 * Muestra barra de progreso, lista de subtareas y formulario inline para agregar.
 */
export function SubtaskSection({ activityId, subtasks, dueDate }: SubtaskSectionProps) {
  const [subtaskToDelete, setSubtaskToDelete] = useState<Subtask | null>(null);
  const [subtaskToEdit, setSubtaskToEdit] = useState<Subtask | null>(null);
  
  const { data: allUserSubtasks = [] } = useAllSubtasks();
  const createSubtaskMutation = useCreateSubtask(activityId);
  const updateStatusMutation = useUpdateSubtaskStatus(activityId);
  const deleteSubtaskMutation = useDeleteSubtask(activityId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateSubtaskForm>({
    resolver: zodResolver(createSubtaskSchema),
    defaultValues: { name: '', target_date: '', estimated_hours: 0 },
  });
  
  const watchedDate = useWatch({ control, name: 'target_date' });
  const watchedHours = useWatch({ control, name: 'estimated_hours' }) || 0;
  const maxSubtaskDate = getDateInputMax(dueDate);

  const { hasExceeded, totalHours: totalPlannedHours, limit, conflictingActivities, hoursInCurrentActivity } = 
    useDailyLimitValidation(
      allUserSubtasks,
      watchedDate,
      undefined,
      activityId,
      Number(watchedHours)
    );

  const onAddSubtask = (data: CreateSubtaskForm) => {
  createSubtaskMutation.mutate(data, {
    onSuccess: () => reset(),
  });
};

  const confirmDelete = () => {
    if (subtaskToDelete) {
      deleteSubtaskMutation.mutate(subtaskToDelete.id, {
        onSuccess: () => setSubtaskToDelete(null),
      });
    }
  };

  const sortedSubtasks = sortSubtasks(subtasks);
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.status === 'completed').length;
  const progressPercent =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;
  const totalHours = subtasks.reduce(
    (sum, s) => sum + Number(s.estimated_hours),
    0,
  );

  const pluralSuffix = totalSubtasks === 1 ? '' : 's';

  return (
    <div className="px-6 py-6 bg-gray-50/50 border-t border-gray-100">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
        Plan de Trabajo
      </h3>

      {/* Barra de progreso */}
      {totalSubtasks > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>
              {completedSubtasks} de {totalSubtasks} completada{pluralSuffix}
            </span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            {totalHours.toFixed(1)} horas estimadas en total
          </p>
        </div>
      )}

      {/* Lista de subtareas */}
      {totalSubtasks === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 mb-4">
          <p className="text-sm text-gray-400 text-center">
            Aún no hay subtareas. Agrega una para empezar a planificar.
          </p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {sortedSubtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              onComplete={() =>
                updateStatusMutation.mutate({
                  id: subtask.id,
                  status: 'completed',
                })
              }
              onPostpone={(note) =>
                updateStatusMutation.mutate({
                  id: subtask.id,
                  status: 'postponed',
                  note,
                })
              }
              onPending={(note) =>
                updateStatusMutation.mutate({
                  id: subtask.id,
                  status: 'pending',
                  note,
                })
              }
              onDelete={() => setSubtaskToDelete(subtask)}
              onEdit={() => setSubtaskToEdit(subtask)}
              isUpdating={updateStatusMutation.isPending}
              isDeleting={
                deleteSubtaskMutation.isPending &&
                subtaskToDelete?.id === subtask.id
              }
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={subtaskToDelete !== null}
        onClose={() => setSubtaskToDelete(null)}
        title="Confirmar eliminación"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubtaskToDelete(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={deleteSubtaskMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={deleteSubtaskMutation.isPending}
            >
              {deleteSubtaskMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Eliminar subtarea
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              ¿Estás seguro de que deseas eliminar la subtarea{' '}
              <span className="font-semibold text-gray-900">
                "{subtaskToDelete?.name}"
              </span>
              ? Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal de edición de subtarea */}
      <EditSubtaskModal
        isOpen={subtaskToEdit !== null}
        onClose={() => setSubtaskToEdit(null)}
        subtask={subtaskToEdit}
        activityId={activityId} 
        dueDate={dueDate}
        allSubtasks={[]}      
      />

      <form onSubmit={handleSubmit(onAddSubtask)} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm" noValidate>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Nueva subtarea
        </p>
          
        <div className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-12 2xl:col-span-5">
            <label htmlFor="new-subtask-name" className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <input
              id="new-subtask-name"
              type="text"
              placeholder="Ej: Revisar bibliografía"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-6 2xl:col-span-3">
            <label htmlFor="new-subtask-date" className="block text-xs font-medium text-gray-700 mb-1">Fecha objetivo</label>
            <input
              id="new-subtask-date"
              type="date"
              max={maxSubtaskDate}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('target_date')}
            />
            {errors.target_date && (
              <p className="mt-1 text-xs text-red-600">
                {errors.target_date.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-6 2xl:col-span-2">
            <label htmlFor="new-subtask-hours" className="block text-xs font-medium text-gray-700 mb-1">Horas</label>
            <input
              id="new-subtask-hours"
              type="number"
              step="0.5"
              min="0.1"
              placeholder="0.0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              {...register('estimated_hours', { valueAsNumber: true })}
            />
            {errors.estimated_hours && (
              <p className="mt-1 text-xs text-red-600">
                {errors.estimated_hours.message}
              </p>
            )}
          </div>

          {hasExceeded && (
            <div className="sm:col-span-12 rounded-md bg-red-50 p-3 text-red-800 border border-red-100 -mt-2 mb-2 animate-in slide-in-from-top-1">
              <div className="flex gap-2 mb-1.5">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold uppercase">
                  Límite de horas excedido ({totalPlannedHours}h / {limit}h)
                </p>
              </div>
              
              <div className="text-[11px] leading-relaxed ml-6">
                <p className="mb-2">
                  No puedes planificar <strong>{watchedHours}h</strong> porque ya tienes horas ocupadas ese día:
                </p>
                <ul className="space-y-1 list-disc pl-3">
                {/* Horas en ESTA actividad */}
                {hoursInCurrentActivity > 0 && (
                  <li>
                    En esta actividad: <strong>
                      {hoursInCurrentActivity}h
                    </strong>
                  </li>
                )}
                  {/* Horas en OTRAS actividades */}
                  {conflictingActivities.map((act: any) => (
                    <li key={act.id}>
                      En "{act.title}": <strong>{act.hours}h</strong>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-red-600 font-medium italic">
                  Tip: Reduce las horas o cambia la fecha para poder agregarla.
                </p>
              </div>
            </div>
          )}

          <div className="sm:col-span-12 2xl:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={createSubtaskMutation.isPending || hasExceeded}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createSubtaskMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Agregar
            </button>
          </div>

        </div>
      </form>

    </div>
  );
}

// ── Componente de subtarea individual ──

interface SubtaskItemProps {
  readonly subtask: Subtask;
  readonly onComplete: () => void;
  readonly onPostpone: (note?: string) => void;
  readonly onPending: (note?: string) => void;  
  readonly onDelete: () => void;
  readonly onEdit: () => void;
  readonly isUpdating: boolean;
  readonly isDeleting: boolean;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function SubtaskItem({
  subtask,
  onComplete,
  onPostpone,
  onPending,
  onDelete,
  onEdit,
  isUpdating,
  isDeleting,
}: SubtaskItemProps) {
  const isCompleted = subtask.status?.toLowerCase() === 'completed';
  const isPostponed = subtask.status?.toLowerCase() === 'postponed';
  const isPending = subtask.status?.toLowerCase() === 'pending';
  const [showPostponeInput, setShowPostponeInput] = useState(false);
  const [postponeNote, setPostponeNote] = useState(subtask.note ?? '');

  const handlePostponeConfirm = () => {
    onPostpone(postponeNote.trim() || undefined);
    setShowPostponeInput(false);
  };

  const handlePendingConfirm = () => {
    onPending('');
    setShowPostponeInput(false);
  };

  return (
    <div
      className={cn(
        'rounded-md border px-4 py-3 transition-colors',
        isCompleted && 'border-gray-100 bg-gray-50/80',
        isPostponed && 'border-orange-200 bg-orange-50/80',
        !isCompleted && !isPostponed && 'border-gray-200 bg-white',
      )}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox de "Hecha" */}
        <button
          type="button"
          onClick={onComplete}
          disabled={isUpdating || isCompleted}
          className="shrink-0 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
          title={isCompleted ? 'Ya marcada como hecha' : 'Marcar como hecha'}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm font-medium truncate',
              isCompleted && 'text-gray-400 line-through',
              isPostponed && 'text-orange-900',
              !isCompleted && !isPostponed && 'text-gray-900',
            )}
          >
            {subtask.name}
          </p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {subtask.target_date}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {subtask.estimated_hours}h
            </span>
            {isPostponed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                <Clock className="h-3 w-3" />
                Pospuesta
              </span>
            )}
          </div>
          {isPostponed && subtask.note && (
            <p className="mt-1 text-xs text-orange-800/90">
              Nota: {subtask.note}
            </p>
          )}
        </div>

        {/* Posponer */}
        <button
          type="button"
          onClick={() => setShowPostponeInput((prev) => !prev)}
          hidden={isCompleted}
          disabled={isUpdating || isCompleted}
          className="shrink-0 rounded p-1 text-gray-300 hover:text-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50"
          title={isCompleted ? 'No se puede posponer una tarea completada' : 'Posponer subtarea'}
        >
          <Clock className="h-4 w-4" />
        </button>

        {/* Editar */}
        <button
          type="button"
          onClick={onEdit}
          hidden={isCompleted}
          disabled={isCompleted} // 2. Bloqueo agregado
          className="shrink-0 rounded p-1 text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50" // Agregada la clase disabled:opacity-50
          title={isCompleted ? 'No se puede editar una tarea completada' : 'Editar subtarea'}
        >
          <Pencil className="h-4 w-4" />
        </button>

        {/* Eliminar */}
        <button
          type="button"
          onClick={onDelete}
          hidden={isCompleted}
          disabled={isDeleting || isCompleted} // 3. Bloqueo agregado (|| isCompleted)
          className="shrink-0 rounded p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          title={isCompleted ? 'No se puede eliminar una tarea completada' : 'Eliminar subtarea'}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showPostponeInput && !isCompleted && (
        <div className="mt-3 rounded-md border border-orange-200 bg-white p-3">
          <label htmlFor={`postpone-note-${subtask.id}`} className="block text-xs font-medium text-gray-700 mb-1">
            {isPostponed ? 'Nota de posposición actual' : 'Nota opcional de posposición'}
          </label>
          <input
            id={`postpone-note-${subtask.id}`}
            type="text"
            value={postponeNote}
            disabled={isPostponed} // Deshabilitar el input si ya está pospuesta y solo se va a remover
            onChange={(event) => setPostponeNote(event.target.value)}
            placeholder="Ej: Falta información del profesor"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPostponeInput(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>

            {/* Si es PENDING: Muestra botón para confirmar posposición */}
            {isPending && (
              <button
                type="button"
                onClick={handlePostponeConfirm}
                disabled={isUpdating}
                className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                Confirmar posponer
              </button>
            )}

            {/* Si es POSTPONED: Muestra botón para remover la posposición y volver a pendiente */}
            {isPostponed && (
              <button
                type="button"
                onClick={handlePendingConfirm}
                disabled={isUpdating}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Remover posposición
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
