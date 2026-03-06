import { api } from "../lib/axios";

export async function getTodayTasks() {
  const response = await api.get("/today/");
  return response.data;
}