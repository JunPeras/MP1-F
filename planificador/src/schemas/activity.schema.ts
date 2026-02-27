import { z } from 'zod';
import { ACTIVITY_TYPES } from '../constants';

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

  // TODO: Add subtasks field when the dynamic form is integrated
  // work_plan: z.array(createSubtaskSchema).optional().default([]),
});

export type CreateActivityForm = z.infer<typeof createActivitySchema>;

export type Activity = CreateActivityForm & {
    id: number;
    created_at: string;
    event_date?: string;
};