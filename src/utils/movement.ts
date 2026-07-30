import type { StockMovement } from "../types";

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
  return {
    ...raw,
    ...extras,
    movement_type: normalizeMovementType(raw.movement_type),
  };
}
