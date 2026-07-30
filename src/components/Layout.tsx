import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/produtos", label: "Produtos", end: false },
  { to: "/movimentacoes", label: "Movimentações", end: false },
  { to: "/usuarios", label: "Usuários", admin: true, end: false },
];

export function Layout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">📦</span>
          <div>
            <strong>Stock</strong>
            <small>Controle de estoque</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems
            .filter((item) => !item.admin || isAdmin)
            .map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="avatar">{user?.name?.charAt(0).toUpperCase() ?? "?"}</span>
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role === "admin" ? "Administrador" : "Usuário"}</small>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
