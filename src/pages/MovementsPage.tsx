import { useCallback, useEffect, useMemo, useState } from "react";
import { getMovements, summarizeMovements } from "../api/movements";
import { MovementList } from "../components/MovementList";
import { Alert, EmptyState, PageHeader, StatCard } from "../components/ui";

export function MovementsPage() {
  const [movements, setMovements] = useState<Awaited<ReturnType<typeof getMovements>>>([]);
  const [filters, setFilters] = useState({
    product_code: "",
    movement_type: "",
    start: "",
    end: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMovements({
        product_code: filters.product_code || undefined,
        movement_type: filters.movement_type || undefined,
        start: filters.start || undefined,
        end: filters.end || undefined,
      });
      setMovements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar movimentações");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const summary = useMemo(() => summarizeMovements(movements), [movements]);

  return (
    <div>
      <PageHeader
        title="Movimentações"
        subtitle="Histórico de entradas e saídas de estoque"
      />

      {error && <Alert>{error}</Alert>}

      <section className="filters-bar">
        <input
          placeholder="Código do produto"
          value={filters.product_code}
          onChange={(e) => setFilters({ ...filters, product_code: e.target.value })}
        />
        <select
          value={filters.movement_type}
          onChange={(e) => setFilters({ ...filters, movement_type: e.target.value })}
        >
          <option value="">Todos os tipos</option>
          <option value="entry">Entradas</option>
          <option value="exit">Saídas</option>
        </select>
        <input
          type="date"
          value={filters.start}
          onChange={(e) => setFilters({ ...filters, start: e.target.value })}
        />
        <input
          type="date"
          value={filters.end}
          onChange={(e) => setFilters({ ...filters, end: e.target.value })}
        />
      </section>

      {!loading && movements.length > 0 && (
        <section className="stats-grid movement-summary">
          <StatCard label="Entradas" value={summary.entries} tone="success" />
          <StatCard label="Unidades entrando" value={summary.entryQty} tone="success" />
          <StatCard label="Saídas" value={summary.exits} tone="warning" />
          <StatCard label="Unidades saindo" value={summary.exitQty} tone="warning" />
        </section>
      )}

      <section className="panel">
        {loading ? (
          <div className="loading-inline">Carregando movimentações...</div>
        ) : movements.length === 0 ? (
          <EmptyState title="Nenhuma movimentação encontrada" />
        ) : (
          <MovementList movements={movements} showProduct />
        )}
      </section>
    </div>
  );
}
