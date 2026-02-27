import { api } from '../lib/axios';
import type { Activity, CreateActivityForm } from '../schemas/activity.schema';

/**
 * Creates a new evaluative activity via POST /activities/.
 */
export async function createActivity(
  data: CreateActivityForm,
): Promise<Activity> {
  const response = await api.post<Activity>('/activities/', {
    title: data.title,
    type: data.type,
    course: data.course,
    due_date: data.due_date,
    event_date: data.event_date,
  });
  return response.data;
}

/**
 * Fetches a single activity by ID via GET /activities/:id/.
 */
export async function getActivityById(id: number): Promise<Activity> {
  const response = await api.get<Activity>(`/activities/${id}/`);
  return response.data;
}
