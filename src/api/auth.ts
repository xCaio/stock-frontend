import { ApiError, apiFetch, setToken } from "./client";
import type { AuthCredentials, LoginResponse, RegisterData, User } from "../types";

function decodeJwtPayload(token: string): { sub?: string } | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function buildUserFromToken(): User | null {
  const token = localStorage.getItem("access_token");
  const email = localStorage.getItem("user_email");
  if (!token || !email) return null;

  const payload = decodeJwtPayload(token);
  const id = payload?.sub ? Number(payload.sub) : 0;
  if (!id) return null;

  return {
    id,
    name: email.split("@")[0],
    email,
    role: "user",
  };
}

export async function login(credentials: AuthCredentials): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
    false,
  );
  setToken(data.access_token);
  return data;
}

export async function register(payload: RegisterData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

export async function refreshToken(): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/refresh");
  setToken(data.access_token);
  return data;
}

/** Perfil do usuário logado. Prefere GET /auth/me; fallback via token se a rota ainda não existir no backend. */
export async function getCurrentUser(): Promise<User> {
  try {
    return await apiFetch<User>("/auth/me");
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 405)) {
      const fallback = buildUserFromToken();
      if (fallback) return fallback;
    }
    throw err;
  }
}

export function logout() {
  setToken(null);
  localStorage.removeItem("user_email");
}

export function storeUserEmail(email: string) {
  localStorage.setItem("user_email", email);
}
