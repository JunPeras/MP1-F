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
}