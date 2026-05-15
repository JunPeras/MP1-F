import { api } from '../lib/axios';
import type { Activity } from '../schemas/activity.schema';

export async function getProgressActivities(): Promise<Activity[]> {
  const response = await api.get<Activity[]>('/progress/');
  return response.data;
}