import { z } from 'zod';
import { ACTIVITY_TYPES } from '../constants';
import { type Subtask } from './subtask.schema';

// Schema para subtareas DENTRO del formulario de actividad.
// Separado del schema standalone para evitar problemas de tipos con el resolver.
const subtaskFormItemSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  target_date: z
    .string()
    .min(1, 'La fecha objetivo es obligatoria'),
  estimated_hours: z
    .number({ error: 'Debe ser un número válido' })
    .positive('Las horas deben ser mayor a 0')
    .max(999, 'El valor máximo es 999'),
});

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .min(5, 'Debe tener mínimo 5 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo debe incluir letras')
    .max(100, 'El título no puede exceder 100 caracteres'),

  type: z.enum(ACTIVITY_TYPES, {
    error: 'Selecciona un tipo de actividad',
  }),

  course: z
    .string()
    .min(1, 'El campo es obligatorio')
    .min(2, 'Debe tener mínimo 2 caracteres')
    .max(50, 'El curso no puede exceder 50 caracteres'),

  due_date: z
    .string()
    .min(1, 'La fecha límite es obligatoria')
    .refine(
      (val) => val >= new Date().toISOString().split('T')[0],
      'La fecha límite debe ser hoy o una fecha futura',
    ),

  event_date: z.string().optional(),

  subtasks: z.array(subtaskFormItemSchema),
});

export type CreateActivityForm = z.infer<typeof createActivitySchema>;

// ── Schema para ACTUALIZAR una actividad (sin subtasks, sin restricción de fecha futura) ──

export const updateActivitySchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .min(5, 'Debe tener mínimo 5 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo debe incluir letras')
    .max(100, 'El título no puede exceder 100 caracteres'),

  type: z.enum(ACTIVITY_TYPES, {
    error: 'Selecciona un tipo de actividad',
  }),

  course: z
    .string()
    .min(1, 'El campo es obligatorio')
    .min(2, 'Debe tener mínimo 2 caracteres')
    .max(50, 'El curso no puede exceder 50 caracteres'),

  due_date: z
    .string()
    .min(1, 'La fecha límite es obligatoria'),

  event_date: z.string().optional(),
});

export type UpdateActivityForm = z.infer<typeof updateActivitySchema>;

export type Activity = Omit<CreateActivityForm, 'subtasks'> & {
    id: number;
    created_at: string;
    event_date?: string;
    status: 'pending' | 'completed';
    subtasks: Subtask[];
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
