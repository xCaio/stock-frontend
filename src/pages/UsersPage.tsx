import { useEffect, useState } from "react";
import { changeUserRole, getUsers, updateUser } from "../api/users";
import { Alert, EmptyState, Modal, PageHeader } from "../components/ui";
import type { User } from "../types";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user" as "user" | "admin" });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(user: User) {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setSubmitting(true);
    setError("");
    try {
      await updateUser(editUser.id, { name: form.name, email: form.email });
      if (form.role !== editUser.role) {
        await changeUserRole(editUser.id, form.role);
      }
      setEditUser(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar usuário");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Usuários" subtitle="Gerencie contas e permissões" />

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div className="loading-inline">Carregando usuários...</div>
      ) : users.length === 0 ? (
        <EmptyState title="Nenhum usuário encontrado" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === "admin" ? "badge-success" : "badge-muted"}`}>
                      {user.role === "admin" ? "Admin" : "Usuário"}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(user)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editUser} title="Editar usuário" onClose={() => setEditUser(null)}>
        <form className="form" onSubmit={handleSave}>
          <label>
            Nome
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            E-mail
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Perfil
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "user" | "admin" })}>
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setEditUser(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
