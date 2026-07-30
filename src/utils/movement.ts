import type { StockMovement } from "../types";
import { toTimestamp } from "./datetime";

/** Movimentação como vem da API (entrada/saida ou entry/exit) */
export type RawMovement = Omit<StockMovement, "movement_type"> & {
  movement_type?: string;
};

export function normalizeMovementType(
  type: string | undefined,
): StockMovement["movement_type"] {
  if (type === "entrada" || type === "entry") return "entry";
  if (type === "saida" || type === "exit") return "exit";
  return undefined;
}

export function normalizeMovement(
  raw: RawMovement,
  extras?: Partial<StockMovement>,
): StockMovement {
  const user_name =
    extras?.user_name ??
    raw.user_name ??
    raw.user?.name;

  return {
    ...raw,
    ...extras,
    user_name,
    movement_type: normalizeMovementType(raw.movement_type),
  };
}

export function sortMovementsNewestFirst(movements: StockMovement[]): StockMovement[] {
  return [...movements].sort((a, b) => {
    const ta = toTimestamp(a.created_at);
    const tb = toTimestamp(b.created_at);
    if (tb !== ta) return tb - ta;
    return (b.id ?? 0) - (a.id ?? 0);
  });
}
