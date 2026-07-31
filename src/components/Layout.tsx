import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AppLogo } from "./AppLogo";
import { APP_BRAND_LINE, APP_NAME_SHORT } from "../constants/app";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/produtos", label: "Produtos", end: false },
  { to: "/movimentacoes", label: "Movimentações", end: false },
  { to: "/usuarios", label: "Usuários", admin: true, end: false },
];

export function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  const visibleNavItems = navItems.filter((item) => !item.admin || isAdmin);

  return (
    <div className="app-shell">
      <header className="mobile-topbar">
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
        <div className="mobile-topbar-brand">
          <AppLogo size="sm" />
          <div>
            <strong>{APP_NAME_SHORT}</strong>
            <small>{APP_BRAND_LINE}</small>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar${menuOpen ? " open" : ""}`}>
        <div className="brand sidebar-brand-desktop">
          <AppLogo size="sm" />
          <div>
            <strong>{APP_NAME_SHORT}</strong>
            <small>{APP_BRAND_LINE}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="avatar">{user?.name?.charAt(0).toUpperCase() ?? "?"}</span>
            <div className="user-chip-text">
              <strong>{user?.name}</strong>
              <small>{user?.role === "admin" ? "Administrador" : "Usuário"}</small>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm btn-block" onClick={logout}>
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
