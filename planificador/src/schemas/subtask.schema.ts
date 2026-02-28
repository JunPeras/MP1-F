import { z } from 'zod';

// ── Schema de validación para crear/editar subtareas ──

export const createSubtaskSchema = z.object({
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

export type CreateSubtaskForm = z.infer<typeof createSubtaskSchema>;

// ── Schema para ACTUALIZAR subtareas (mismos campos que crear) ──

export const updateSubtaskSchema = createSubtaskSchema;

export type UpdateSubtaskForm = z.infer<typeof updateSubtaskSchema>;

// ── Tipo completo de subtarea (respuesta del backend) ──

export interface Subtask {
  id: number;
  activity: number;
  name: string;
  target_date: string;
  estimated_hours: number;
  created_at: string;
  completed: boolean;
}
