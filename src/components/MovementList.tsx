import { Link } from "react-router-dom";
import type { StockMovement } from "../types";
import { formatDateTime } from "../utils/datetime";

interface MovementListProps {
  movements: StockMovement[];
  showProduct?: boolean;
  emptyMessage?: string;
}

export function MovementList({
  movements,
  showProduct = false,
  emptyMessage = "Nenhuma movimentação registrada.",
}: MovementListProps) {
  if (movements.length === 0) {
    return <p className="muted">{emptyMessage}</p>;
  }

  return (
    <ul className="movement-feed">
      {movements.map((m, i) => {
        const isEntry = m.movement_type === "entry";
        const hasStockTrail =
          m.stock_before !== undefined && m.stock_after !== undefined;

        return (
          <li
            key={m.id ?? i}
            className={`movement-item ${isEntry ? "movement-entry" : "movement-exit"}`}
          >
            <div className="movement-icon" aria-hidden>
              {isEntry ? "↑" : "↓"}
            </div>

            <div className="movement-body">
              <div className="movement-top">
                <span className={`badge ${isEntry ? "badge-success" : "badge-warning"}`}>
                  {isEntry ? "Entrada" : "Saída"}
                </span>

                {showProduct && (
                  m.product_code ? (
                    <Link to={`/produtos/${m.product_code}`} className="movement-product link">
                      {m.product_code}
                    </Link>
                  ) : (
                    <span className="movement-product muted">Produto #{m.product_id ?? "?"}</span>
                  )
                )}

                <time className="movement-date">{formatDateTime(m.created_at)}</time>
              </div>

              <div className="movement-details">
                <span className={`movement-qty ${isEntry ? "qty-entry" : "qty-exit"}`}>
                  {isEntry ? "+" : "−"}{m.quantity} un.
                </span>

                {hasStockTrail && (
                  <span className="movement-stock">
                    Estoque: {m.stock_before} → <strong>{m.stock_after}</strong>
                  </span>
                )}

                {m.user_name && (
                  <span className="movement-user">por {m.user_name}</span>
                )}

                {m.observation && (
                  <span className="movement-note">"{m.observation}"</span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
