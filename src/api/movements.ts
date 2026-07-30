import { apiFetch } from "./client";
import { getProducts } from "./products";
import { getUsers } from "./users";
import type { MovementFilters, Product, StockMovement } from "../types";
import { normalizeMovement, sortMovementsNewestFirst, type RawMovement } from "../utils/movement";

async function buildProductCodeMap(): Promise<Map<number, string>> {
  const products = await getProducts().catch(() => [] as Product[]);
  const map = new Map<number, string>();
  for (const p of products) {
    if (p.id != null) map.set(p.id, p.code);
  }
  return map;
}

async function buildUserNameMap(): Promise<Map<number, string>> {
  const users = await getUsers().catch(() => []);
  const map = new Map<number, string>();
  for (const u of users) {
    map.set(u.id, u.name);
  }
  return map;
}

function enrichWithProductCodes(
  movements: RawMovement[],
  codeById: Map<number, string>,
  nameById: Map<number, string>,
): StockMovement[] {
  return movements.map((m) => {
    const code =
      m.product_code ??
      m.product?.code ??
      (m.product_id != null ? codeById.get(m.product_id) : undefined);
    const user_name =
      m.user_name ??
      m.user?.name ??
      (m.user_id != null ? nameById.get(m.user_id) : undefined);
    return normalizeMovement(m, { product_code: code, user_name });
  });
}

export async function getMovements(filters: MovementFilters = {}): Promise<StockMovement[]> {
  const params = new URLSearchParams();
  if (filters.product_code) params.set("product_code", filters.product_code);
  if (filters.user_id) params.set("user_id", String(filters.user_id));
  if (filters.movement_type === "entry") params.set("movement_type", "entrada");
  else if (filters.movement_type === "exit") params.set("movement_type", "saida");
  else if (filters.movement_type) params.set("movement_type", filters.movement_type);
  if (filters.start) params.set("start", filters.start);
  if (filters.end) params.set("end", filters.end);
  const query = params.toString();

  const [data, codeById, nameById] = await Promise.all([
    apiFetch<RawMovement[]>(`/movements/${query ? `?${query}` : ""}`),
    buildProductCodeMap(),
    buildUserNameMap(),
  ]);

  const list = Array.isArray(data) ? data : [];
  return sortMovementsNewestFirst(enrichWithProductCodes(list, codeById, nameById));
}

export function summarizeMovements(movements: StockMovement[]) {
  return movements.reduce(
    (acc, m) => {
      if (m.movement_type === "entry") {
        acc.entries += 1;
        acc.entryQty += m.quantity;
      } else if (m.movement_type === "exit") {
        acc.exits += 1;
        acc.exitQty += m.quantity;
      }
      return acc;
    },
    { entries: 0, exits: 0, entryQty: 0, exitQty: 0 },
  );
}
