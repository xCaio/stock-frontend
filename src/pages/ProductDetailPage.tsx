import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  entryProduct,
  exitProduct,
  getProduct,
  getProductMovements,
  updateProduct,
} from "../api/products";
import { PRODUCT_TYPES, normalizeProductType } from "../constants/products";
import { useAuth } from "../context/AuthContext";
import { Alert, Modal, NumberField, PageHeader, parseRequiredInt } from "../components/ui";
import { MovementList } from "../components/MovementList";
import { ProductTypeBadge } from "../components/ProductTypeBadge";
import type { Product, StockMovement } from "../types";

export function ProductDetailPage() {
  const { code = "" } = useParams();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [movementModal, setMovementModal] = useState<"entry" | "exit" | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [observation, setObservation] = useState("");
  const [editForm, setEditForm] = useState({ code: "", product_type: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prod, movs] = await Promise.all([
        getProduct(code),
        getProductMovements(code),
      ]);
      setProduct(prod);
      setMovements(movs);
      setEditForm({
        code: prod.code,
        product_type: normalizeProductType(prod.product_type) || "etiqueta",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMovement(e: React.FormEvent) {
    e.preventDefault();
    if (!movementModal) return;
    setSubmitting(true);
    setError("");
    try {
      const qty = parseRequiredInt(quantity, "Quantidade", 1);
      const payload = { quantity: qty, observation: observation || undefined };
      if (movementModal === "entry") {
        await entryProduct(code, payload);
      } else {
        await exitProduct(code, payload);
      }
      setMovementModal(null);
      setQuantity("");
      setObservation("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na movimentação");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await updateProduct(code, editForm);
      setEditModal(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao editar produto");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="loading-inline">Carregando produto...</div>;
  if (!product) return <Alert>Produto não encontrado.</Alert>;

  const isLow = product.stock <= product.stock_minimum;

  return (
    <div>
      <PageHeader
        title={product.code}
        subtitle={<ProductTypeBadge value={product.product_type} />}
        action={
          <div className="actions-row">
            <Link to="/produtos" className="btn btn-ghost">← Voltar</Link>
            <button type="button" className="btn btn-success" onClick={() => { setQuantity(""); setMovementModal("entry"); }}>
              Entrada
            </button>
            <button type="button" className="btn btn-warning" onClick={() => { setQuantity(""); setMovementModal("exit"); }}>
              Saída
            </button>
            {isAdmin && (
              <button type="button" className="btn btn-ghost" onClick={() => setEditModal(true)}>
                Editar
              </button>
            )}
          </div>
        }
      />

      {error && <Alert>{error}</Alert>}

      <section className="detail-grid">
        <div className="panel">
          <h2>Informações</h2>
          <dl className="detail-list">
            <div><dt>Código</dt><dd>{product.code}</dd></div>
            <div><dt>Tipo</dt><dd><ProductTypeBadge value={product.product_type} /></dd></div>
            <div><dt>Estoque atual</dt><dd className={isLow ? "text-warning" : ""}>{product.stock}</dd></div>
            <div><dt>Estoque mínimo</dt><dd>{product.stock_minimum}</dd></div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`badge ${product.active === false ? "badge-muted" : "badge-success"}`}>
                  {product.active === false ? "Inativo" : "Ativo"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="panel">
          <h2>Histórico de movimentações</h2>
          <MovementList movements={movements} />
        </div>
      </section>

      <Modal
        open={!!movementModal}
        title={movementModal === "entry" ? "Registrar entrada" : "Registrar saída"}
        onClose={() => { setMovementModal(null); setQuantity(""); }}
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
            <button type="button" className="btn btn-ghost" onClick={() => setMovementModal(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} title="Editar produto" onClose={() => setEditModal(false)}>
        <form className="form" onSubmit={handleEdit}>
          <label>
            Código
            <input
              value={editForm.code}
              onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
              required
            />
          </label>
          <label>
            Tipo
            <select
              value={editForm.product_type}
              onChange={(e) => setEditForm({ ...editForm, product_type: e.target.value })}
              required
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setEditModal(false)}>
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
