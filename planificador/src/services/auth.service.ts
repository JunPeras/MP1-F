import { api } from "../lib/axios";

interface LoginResponse {
  user: any;
  tokens: {
    access: string;
    refresh: string;
  };
}

export async function login(username: string, password: string) {
  const response = await api.post<LoginResponse>("/auth/login/", {
    username,
    password,
  });

  const accessToken = response.data.tokens.access;

  localStorage.setItem("access_token", accessToken);

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