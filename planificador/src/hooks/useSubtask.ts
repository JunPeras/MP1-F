import { useQuery } from '@tanstack/react-query';
import { api } from "../lib/axios";

export const useAllSubtasks = () => {
  return useQuery({
    queryKey: ['subtasks', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/subtasks/');
      return data;
    },
  });
};