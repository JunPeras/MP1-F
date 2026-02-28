import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateActivity } from '../services/activity.service';
import type { UpdateActivityForm } from '../schemas/activity.schema';

/**
 * Hook para actualizar los campos de una actividad existente.
 * Invalida la cache de la actividad tras el éxito.
 */
export function useUpdateActivity(activityId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateActivityForm) => updateActivity(activityId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      toast.success('Actividad actualizada correctamente');
    },

    onError: () => {
      toast.error(
        'No se pudo actualizar la actividad. Verifica los campos e intenta de nuevo.',
      );
    },
  });
}
