import { api } from "../lib/axios";

export async function login(username: string, password: string) {
  const response = await api.post('/auth/login/', {
    username,
    password,
  });

  const accessToken = response.data.tokens.access;
  const userData = response.data.user;

  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('username', username);

  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  return accessToken;
}

export async function register(userData: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  daily_hour_limit: number;
}) {
  const response = await api.post("/auth/register/", userData);
  return response.data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('username');
}

/**
 * Check if a proposed daily_hour_limit conflicts with already-scheduled subtasks.
 * Returns the conflict details or null if no conflicts.
 */
export async function checkLimitConflicts(dailyHourLimit: number) {
  const response = await api.get('/auth/profile/check-limit/', {
    params: { daily_hour_limit: dailyHourLimit },
  });
  return response.data;
}

/**
 * Update the current user's profile (e.g. daily_hour_limit).
 * Updates localStorage with the new user data.
 */
export async function updateProfile(data: { daily_hour_limit: number }) {
  const response = await api.patch('/auth/profile/update/', data);

  // Sync localStorage with the updated user data
  localStorage.setItem('user', JSON.stringify(response.data));

  return response.data;
}