import { apiFetch } from "./client";
import type { DashboardData, Product } from "../types";

interface BackendDashboard {
  cards?: {
    total_produtos?: number | null;
    entradas_hoje?: number;
    saidas_hoje?: number;
    sem_estoque?: number;
    estoque_baixo?: {
      total?: number;
      produtos?: Array<{
        code: string;
        stock: number;
        stock_minimum: number;
        product_type?: string;
      }>;
    };
  };
}

export async function getDashboard(): Promise<DashboardData> {
  const raw = await apiFetch<BackendDashboard>("/dashboard/", {}, false);
  const cards = raw.cards ?? {};

  const lowStockProducts: Product[] =
    cards.estoque_baixo?.produtos?.map((p) => ({
      code: p.code,
      product_type: p.product_type ?? "—",
      stock: p.stock,
      stock_minimum: p.stock_minimum,
    })) ?? [];

  return {
    total_stock: cards.total_produtos ?? undefined,
    entries_today: cards.entradas_hoje,
    exits_today: cards.saidas_hoje,
    out_of_stock: cards.sem_estoque,
    low_stock_count: cards.estoque_baixo?.total ?? lowStockProducts.length,
    low_stock_products: lowStockProducts,
  };
}
