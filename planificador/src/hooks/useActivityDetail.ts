import { useQuery } from '@tanstack/react-query';
import { getActivityById } from '../services/activity.service';

export function useActivityDetail(id: number) {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityById(id),
    enabled: !Number.isNaN(id) && id > 0,
  });
}
