import { apiFetch } from "./client";
import type { User } from "../types";

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users/");
}

export async function getUser(id: number): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}

export async function updateUser(id: number, data: Partial<User & { password?: string }>) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changeUserRole(id: number, role: "user" | "admin") {
  return apiFetch(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
