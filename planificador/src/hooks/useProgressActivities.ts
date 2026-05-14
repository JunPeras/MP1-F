import { useQuery } from '@tanstack/react-query';
import { getProgressActivities } from '../services/progress.service';

export function useProgressActivities() {
  return useQuery({
    queryKey: ['progressActivities'],
    queryFn: getProgressActivities,
  });
}