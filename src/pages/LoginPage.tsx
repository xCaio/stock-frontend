import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { AppLogo } from "../components/AppLogo";
import { APP_NAME, APP_TAGLINE } from "../constants/app";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui";

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <AppLogo size="md" />
          <h1>{APP_NAME}</h1>
          <p>{APP_TAGLINE}</p>
        </div>

        {error && <Alert>{error}</Alert>}

        <form onSubmit={handleSubmit} className="form">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="seu@email.com"
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
