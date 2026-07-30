import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/dashboard";
import { getLowStock } from "../api/products";
import { PageHeader, StatCard, EmptyState, Alert } from "../components/ui";
import { ProductTypeBadge } from "../components/ProductTypeBadge";
import type { DashboardData, Product } from "../types";

function ensureProducts(value: unknown): Product[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && "products" in value) {
    const products = (value as { products?: unknown }).products;
    return Array.isArray(products) ? products : [];
  }
  return [];
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dash, lowRaw] = await Promise.all([
          getDashboard().catch(() => null),
          getLowStock().catch(() => []),
        ]);
        setDashboard(dash);

        const fromDashboard = ensureProducts(dash?.low_stock_products);
        const fromApi = ensureProducts(lowRaw);
        setLowStock(fromApi.length > 0 ? fromApi : fromDashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="loading-inline">Carregando dashboard...</div>;
  }

  const lowStockCount = lowStock.length || dashboard?.low_stock_count || 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral do estoque" />

      {error && <Alert>{error}</Alert>}

      <section className="stats-grid">
        <StatCard label="Total em estoque" value={dashboard?.total_stock ?? "—"} />
        <StatCard label="Entradas hoje" value={dashboard?.entries_today ?? "—"} tone="success" />
        <StatCard label="Saídas hoje" value={dashboard?.exits_today ?? "—"} />
        <StatCard label="Estoque baixo" value={lowStockCount} tone="warning" />
        <StatCard label="Sem estoque" value={dashboard?.out_of_stock ?? "—"} tone="warning" />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Produtos com estoque baixo</h2>
          <Link to="/produtos" className="btn btn-ghost btn-sm">Ver todos</Link>
        </div>

        {lowStock.length === 0 ? (
          <EmptyState title="Nenhum produto com estoque baixo" description="Tudo certo por aqui." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Estoque</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((product) => (
                  <tr key={product.code}>
                    <td>
                      <Link to={`/produtos/${product.code}`} className="link">
                        {product.code}
                      </Link>
                    </td>
                    <td><ProductTypeBadge value={product.product_type} /></td>
                    <td className="text-warning">{product.stock}</td>
                    <td>{product.stock_minimum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
