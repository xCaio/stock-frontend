import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  activateProduct,
  createProduct,
  deactivateProduct,
  entryProduct,
  exitProduct,
  getProducts,
} from "../api/products";
import { PRODUCT_TYPES } from "../constants/products";
import { useAuth } from "../context/AuthContext";
import { Alert, EmptyState, Modal, NumberField, PageHeader, parseRequiredInt } from "../components/ui";
import { ProductTypeBadge } from "../components/ProductTypeBadge";
import type { Product } from "../types";

const emptyForm = {
  code: "",
  product_type: "etiqueta" as const,
  stock: "",
  stock_minimum: "",
};

export function ProductsPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [movementTarget, setMovementTarget] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<"entry" | "exit" | null>(null);
  const [quantity, setQuantity] = useState("");
  const [observation, setObservation] = useState("");
  const [movementSubmitting, setMovementSubmitting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts({
        search: search || undefined,
        type: typeFilter || undefined,
        active: activeFilter === "" ? undefined : activeFilter === "true",
      });
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, activeFilter]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createProduct({
        code: form.code,
        product_type: form.product_type,
        stock: parseRequiredInt(form.stock, "Estoque inicial", 0),
        stock_minimum: parseRequiredInt(form.stock_minimum, "Estoque mínimo", 0),
      });
      setModalOpen(false);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(product: Product) {
    try {
      if (product.active === false) {
        await activateProduct(product.code);
      } else {
        await deactivateProduct(product.code);
      }
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar status");
    }
  }

  function openMovement(product: Product, type: "entry" | "exit") {
    setMovementTarget(product);
    setMovementType(type);
    setQuantity("");
    setObservation("");
  }

  function closeMovement() {
    setMovementTarget(null);
    setMovementType(null);
    setQuantity("");
    setObservation("");
  }

  async function handleMovement(e: React.FormEvent) {
    e.preventDefault();
    if (!movementTarget || !movementType) return;
    setMovementSubmitting(true);
    setError("");
    try {
      const qty = parseRequiredInt(quantity, "Quantidade", 1);
      const payload = { quantity: qty, observation: observation || undefined };
      if (movementType === "entry") {
        await entryProduct(movementTarget.code, payload);
      } else {
        await exitProduct(movementTarget.code, payload);
      }
      closeMovement();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na movimentação");
    } finally {
      setMovementSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle="Gerencie insumos e estoque"
        action={
          isAdmin ? (
            <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
              + Novo produto
            </button>
          ) : undefined
        }
      />

      {error && <Alert>{error}</Alert>}

      <section className="filters-bar">
        <input
          type="search"
          placeholder="Buscar por código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">Todos os tipos</option>
          {PRODUCT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value as "" | "true" | "false")}>
          <option value="">Todos os status</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </section>

      {loading ? (
        <div className="loading-inline">Carregando produtos...</div>
      ) : products.length === 0 ? (
        <EmptyState title="Nenhum produto encontrado" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Estoque</th>
                <th>Mínimo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLow = product.stock <= product.stock_minimum;
                return (
                  <tr key={product.code}>
                    <td>
                      <Link to={`/produtos/${product.code}`} className="link">
                        {product.code}
                      </Link>
                    </td>
                    <td><ProductTypeBadge value={product.product_type} /></td>
                    <td className={isLow ? "text-warning" : ""}>{product.stock}</td>
                    <td>{product.stock_minimum}</td>
                    <td>
                      <span className={`badge ${product.active === false ? "badge-muted" : "badge-success"}`}>
                        {product.active === false ? "Inativo" : "Ativo"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => openMovement(product, "entry")}
                      >
                        Entrada
                      </button>
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => openMovement(product, "exit")}
                      >
                        Saída
                      </button>
                      <Link to={`/produtos/${product.code}`} className="btn btn-ghost btn-sm">
                        Detalhes
                      </Link>
                      {isAdmin && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleActive(product)}>
                          {product.active === false ? "Ativar" : "Inativar"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title="Novo produto" onClose={() => setModalOpen(false)}>
        <form className="form" onSubmit={handleCreate}>
          <label>
            Código
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
              placeholder="Ex: ETQ-001"
            />
          </label>
          <label>
            Tipo
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value as typeof form.product_type })}
              required
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Estoque inicial
            <NumberField
              value={form.stock}
              onChange={(stock) => setForm({ ...form, stock })}
              required
            />
          </label>
          <label>
            Estoque mínimo
            <NumberField
              value={form.stock_minimum}
              onChange={(stock_minimum) => setForm({ ...form, stock_minimum })}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Salvando..." : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!movementTarget && !!movementType}
        title={
          movementType === "entry"
            ? `Entrada — ${movementTarget?.code ?? ""}`
            : `Saída — ${movementTarget?.code ?? ""}`
        }
        onClose={closeMovement}
      >
        <form className="form" onSubmit={handleMovement}>
          <label>
            Quantidade
            <NumberField
              value={quantity}
              onChange={setQuantity}
              min={1}
              placeholder="1"
              required
            />
          </label>
          <label>
            Observação (opcional)
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={closeMovement}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={movementSubmitting}>
              {movementSubmitting ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
