import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import { useState } from 'react';

import {
  createActivitySchema,
  type CreateActivityForm,
} from '../schemas/activity.schema';
import { ACTIVITY_TYPES, ACTIVITY_TYPE_LABEL } from '../constants';
import { createActivity } from '../services/activity.service';
import { createSubtask } from '../services/subtask.service';
import { Modal } from '../components/ui/Modal';
import { SubtaskFormList } from '../components/ui/SubtaskFormList';
import { useAllSubtasks } from '../hooks/useSubtask';

export default function CrearActividadPage() {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: allExistingSubtasks = [] } = useAllSubtasks();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityForm>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: '',
      type: undefined,
      course: '',
      due_date: '',
      event_date: '',
      subtasks: [],
    },
  });

  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  const limit = user?.daily_hour_limit ?? 6;

  const watchedSubtasks = useWatch({ control, name: 'subtasks' }) || [];

  const datesInForm = watchedSubtasks
    .map((st: any) => st.target_date)
    .filter(Boolean);

  const hasExceeded = datesInForm.some((date) => {
    const hoursInDB = allExistingSubtasks
      .filter((s: any) => s.target_date === date)
      .reduce((sum: number, s: { estimated_hours: any; }) => sum + Number(s.estimated_hours), 0);

    const hoursInForm = watchedSubtasks
      .filter((st: any) => st.target_date === date)
      .reduce((sum, st) => sum + (Number(st.estimated_hours) || 0), 0);

    return (hoursInDB + hoursInForm) > limit;
  });

  const onSubmit = async (data: CreateActivityForm) => {
    try {
      const { subtasks, ...activityData } = data;

      const activity = await createActivity(activityData as CreateActivityForm);
      

      // Crear subtareas en paralelo si las hay
      if (subtasks && subtasks.length > 0) {
      const results = await Promise.allSettled(
        subtasks.map((s) => 
          createSubtask({ 
            ...s, 
            activity: activity.id,
          }),
      ),
    );

        const failed = results.filter((r) => r.status === 'rejected').length;

        if (failed > 0) {
          toast.warning(
            `La actividad se creó, pero ${failed} subtarea(s) no se pudieron guardar. Puedes agregarlas desde el detalle.`,
          );
        } else {
          toast.success('¡Actividad y subtareas creadas exitosamente!');
        }
      } else {
        toast.success('¡Actividad creada exitosamente! Puedes agregar subtareas desde el detalle.');
      }

      navigate(`/actividad/${activity.id}`);
    } catch {
      toast.error('No se pudo crear la actividad. Verifica los campos obligatorios e inténtalo nuevamente.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Crear Nueva Actividad
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* ── Sección 1: Información General ── */}
          <section className="space-y-4">
            <header className="border-b border-gray-100 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Información General
              </h2>
              <p className="text-xs text-gray-500">
                Define el nombre, categoría y curso de la actividad.
              </p>
            </header>

            <div className="space-y-4 pt-2">
              {/* Título */}
              <div>
                <label
                  htmlFor="titulo"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="titulo"
                  type="text"
                  placeholder="Ej: Parcial 2 de Bases de Datos"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Tipo de actividad */}
              <div>
                <label
                  htmlFor="tipo"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Tipo de actividad <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipo"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  defaultValue=""
                  {...register('type')}
                >
                  <option value="" disabled>
                    Selecciona un tipo
                  </option>
                  {ACTIVITY_TYPES.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {ACTIVITY_TYPE_LABEL[tipo]}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Curso */}
              <div>
                <label
                  htmlFor="curso"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Curso <span className="text-red-500">*</span>
                </label>
                <input
                  id="curso"
                  type="text"
                  placeholder="Ej: Bases de Datos I"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  {...register('course')}
                />
                {errors.course && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.course.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ── Sección 2: Programación y Entrega ── */}
          <section className="space-y-4">
            <header className="border-b border-gray-100 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Programación y Entrega
              </h2>
              <p className="text-xs text-gray-500">
                Establece los plazos y fechas importantes.
              </p>
            </header>

            <div className="grid gap-6 pt-2 sm:grid-cols-2">

              {/* Fecha/hora del evento */}
              <div>
                <label
                  htmlFor="fecha_evento"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Fecha y hora del evento
                </label>
                <p className="mb-2 text-xs text-gray-600">
                  Momento en que ocurre la actividad
                </p>
                <input
                  id="fecha_evento"
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  {...register('event_date')}
                />
              </div>
              
              {/* Fecha límite */}
              <div>
                <label
                  htmlFor="fecha_limite"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Fecha límite <span className="text-red-500">*</span>
                </label>
                <p className="mb-2 text-xs text-gray-600">
                  Último momento para entregar la actividad
                </p>
                <input
                  id="fecha_limite"
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  {...register('due_date')}
                />
                {errors.due_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.due_date.message}
                  </p>
                )}
              </div>
            </div>

          </section>

          {/* ── Sección 3: Plan de Trabajo (Subtareas) ── */}
          <SubtaskFormList control={control} errors={errors} />

          {hasExceeded && (
            <div className="mt-4 rounded-md bg-red-50 p-4 border border-red-200 animate-in slide-in-from-top-2 duration-300">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800">
                    Límite de horas excedido
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>
                      Has superado el límite de <strong>{limit} horas</strong> disponibles. 
                      Por favor, ajusta los tiempos para no sobrecargarte
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Botones ── */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || hasExceeded}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Actividad
                </>
              )}
            </button>

          </div>
        </div>
      </form>

      {/* Modal de Confirmación de Cancelación */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="¿Descartar cambios?"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Seguir editando
            </button>
            <button
              type="button"
              onClick={() => navigate('/hoy')}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Descartar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          ¿Deseas descartar los cambios? Se perderá toda la información
          ingresada en el formulario.
        </p>
      </Modal>
    </div>
  );
}
