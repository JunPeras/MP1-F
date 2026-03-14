import { api } from '../lib/axios';
import type { Activity, CreateActivityForm, UpdateActivityForm, ApiResponse } from '../schemas/activity.schema';

/**
 * Creates a new evaluative activity via POST /activities/.
 * Supports sending subtasks in the same payload for atomic creation.
 */
export async function createActivity(
  data: CreateActivityForm,
): Promise<Activity> {

  const { title, type, course, due_date, event_date, subtasks } = data;
  
  const response = await api.post<ApiResponse<Activity>>('/activities/', {
    title,
    type,
    course,
    due_date,
    event_date: event_date || null,
    ...(subtasks && subtasks.length > 0 ? { subtasks } : {}),
  });

  return response.data.data;
}

/**
 * Fetches a single activity by ID via GET /activities/:id/.
 */
export async function getActivityById(id: number): Promise<Activity> {
  const response = await api.get<Activity>(`/activities/${id}/`);
  return response.data;
}

/**
 * Updates an activity (partial) via PATCH /activities/:id/.
 */
export async function updateActivity(
  id: number,
  data: UpdateActivityForm,
): Promise<Activity> {
  const response = await api.patch<Activity>(`/activities/${id}/`, {
    ...data,
    event_date: data.event_date || null,
  });
  return response.data;
}

/**
 * Deletes an activity via DELETE /activities/:id/.
 */
export async function deleteActivity(id: number): Promise<void> {
  await api.delete(`/activities/${id}/`);
}
