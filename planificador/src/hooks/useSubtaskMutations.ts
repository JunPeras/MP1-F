import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from '../services/subtask.service';
import type { CreateSubtaskForm, UpdateSubtaskForm } from '../schemas/subtask.schema';

/**
 * Hook para crear una subtarea y refrescar la actividad en cache.
 */
export function useCreateSubtask(activityId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubtaskForm) =>
      createSubtask({ ...data, activity: activityId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      toast.success('Subtarea creada correctamente');
    },

    onError: () => {
      toast.error('No se pudo crear la subtarea. Verifica los campos e intenta de nuevo.');
    },
  });
}

/**
 * Hook para actualizar el estado de una subtarea (completed, postponed o pending)
 * y enviar una nota opcional cuando corresponda.
 */
export function useUpdateSubtaskStatus(activityId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: number;
      status: 'pending' | 'completed' | 'postponed';
      note?: string;
    }) => updateSubtask(id, { status, note }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });

      if (variables.status === 'completed') {
        toast.success('Subtarea marcada como hecha');
      }

      if (variables.status === 'postponed') {
        toast.success('Subtarea pospuesta correctamente');
      }
    },

    onError: () => {
      toast.error('No se pudo actualizar la subtarea.');
    },
  });
}

/**
 * Hook para eliminar una subtarea.
 */
export function useDeleteSubtask(activityId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subtaskId: number) => deleteSubtask(subtaskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      toast.success('Subtarea eliminada');
    },

    onError: () => {
      toast.error('No se pudo eliminar la subtarea.');
    },
  });
}

/**
 * Hook para actualizar los campos de una subtarea (nombre, fecha, horas).
 */
export function useUpdateSubtask(activityId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubtaskForm }) =>
      updateSubtask(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      toast.success('Subtarea actualizada correctamente');
    },

    onError: () => {
      toast.error('No se pudo actualizar la subtarea.');
    },
  });
}
