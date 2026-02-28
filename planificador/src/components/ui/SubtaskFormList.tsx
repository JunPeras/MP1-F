import { useFieldArray, type Control, type FieldErrors } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateActivityForm } from '../../schemas/activity.schema';

interface SubtaskFormListProps {
  readonly control: Control<CreateActivityForm>;
  readonly errors: FieldErrors<CreateActivityForm>;
}

/**
 * Componente reutilizable para agregar/eliminar subtareas dinámicamente
 * dentro del formulario de creación o edición de actividad.
 *
 * Usa `useFieldArray` con el campo `subtasks` del form padre.
 */
export function SubtaskFormList({ control, errors }: SubtaskFormListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });

  const handleAdd = () => {
    append({ name: '', target_date: '', estimated_hours: 0 });
  };

  return (
    <section className="space-y-4">
      <header className="border-b border-gray-100 pb-2">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Plan de Trabajo
        </h2>
        <p className="text-xs text-gray-500">
          Descompone la actividad en subtareas con fecha y horas estimadas.
        </p>
      </header>

      <div className="space-y-3 pt-2">
        {fields.length === 0 && (
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
            <p className="text-sm text-gray-400 text-center">
              Agrega subtareas para planificar tu trabajo.
            </p>
          </div>
        )}

        {fields.map((field, index) => {
          const subtaskErrors = errors.subtasks?.[index];

          return (
            <div
              key={field.id}
              className="rounded-md border border-gray-200 bg-gray-50/50 p-4 space-y-3"
            >
              {/* Encabezado de fila */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Subtarea {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar subtarea"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>

              {/* Campos */}
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Nombre */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`subtask-name-${index}`}
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`subtask-name-${index}`}
                    type="text"
                    placeholder="Ej: Estudiar capítulo 3"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    {...control.register(`subtasks.${index}.name`)}
                  />
                  {subtaskErrors?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {subtaskErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Fecha objetivo */}
                <div>
                  <label
                    htmlFor={`subtask-date-${index}`}
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Fecha objetivo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`subtask-date-${index}`}
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    {...control.register(`subtasks.${index}.target_date`)}
                  />
                  {subtaskErrors?.target_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {subtaskErrors.target_date.message}
                    </p>
                  )}
                </div>

                {/* Horas estimadas */}
                <div>
                  <label
                    htmlFor={`subtask-hours-${index}`}
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Horas estimadas <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`subtask-hours-${index}`}
                    type="number"
                    step="0.5"
                    min="0.1"
                    placeholder="Ej: 2.5"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    {...control.register(`subtasks.${index}.estimated_hours`, { valueAsNumber: true })}
                  />
                  {subtaskErrors?.estimated_hours && (
                    <p className="mt-1 text-sm text-red-600">
                      {subtaskErrors.estimated_hours.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón agregar */}
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Agregar subtarea
      </button>
    </section>
  );
}
