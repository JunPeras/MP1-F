import { useQuery } from '@tanstack/react-query';
import { getTodayTasks } from '../services/today.service';

export const useTodayTasks = () => {
  return useQuery({
    queryKey: ['todayTasks'],
    queryFn: getTodayTasks,
  });
};