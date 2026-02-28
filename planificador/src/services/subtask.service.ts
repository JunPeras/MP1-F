import { api } from '../lib/axios';
import type { CreateSubtaskForm, Subtask } from '../schemas/subtask.schema';
import type { ApiResponse } from '../schemas/activity.schema';

/**
 * Creates a new subtask associated to an activity via POST /subtasks/.
 */
export async function createSubtask(
  data: CreateSubtaskForm & { activity: number },
): Promise<Subtask> {
  const response = await api.post<ApiResponse<Subtask>>('/subtasks/', data);
  return response.data.data;
}

/**
 * Fetches all subtasks for a given activity via GET /activities/:id/subtasks/.
 */
export async function getSubtasksByActivity(
  activityId: number,
): Promise<Subtask[]> {
  const response = await api.get<{ success: boolean; subtasks: Subtask[] }>(
    `/activities/${activityId}/subtasks/`,
  );
  return response.data.subtasks;
}

/**
 * Updates a subtask (partial) via PATCH /subtasks/:id/.
 */
export async function updateSubtask(
  id: number,
  data: Partial<Pick<Subtask, 'name' | 'target_date' | 'estimated_hours' | 'completed'>>,
): Promise<Subtask> {
  const response = await api.patch<Subtask>(`/subtasks/${id}/`, data);
  return response.data;
}

/**
 * Deletes a subtask via DELETE /subtasks/:id/.
 */
export async function deleteSubtask(id: number): Promise<void> {
  await api.delete(`/subtasks/${id}/`);
}
