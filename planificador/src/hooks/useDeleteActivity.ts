import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { deleteActivity } from '../services/activity.service';

/**
 * Hook para eliminar una actividad con invalidación de cache y redirección.
 */
export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (activityId: number) => deleteActivity(activityId),

    onSuccess: (_data, activityId) => {
      queryClient.removeQueries({ queryKey: ['activity', activityId] });
      toast.success('Actividad eliminada correctamente');
      navigate('/hoy');
    },

    onError: () => {
      toast.error('No se pudo eliminar la actividad. Intenta de nuevo.');
    },
  });
}
