import { assertProductType, normalizeProductType } from "../constants/products";
import { normalizeMovement, type RawMovement } from "../utils/movement";
import { apiFetch } from "./client";
import type { Product, ProductFilters, StockMovement } from "../types";

function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    id: raw.id != null ? Number(raw.id) : undefined,
    code: String(raw.code ?? ""),
    product_type: normalizeProductType(raw.product_type ?? raw.productType),
    stock: Number(raw.stock ?? 0),
    stock_minimum: Number(raw.stock_minimum ?? raw.stockMinimum ?? 0),
    active: raw.active != null ? Boolean(raw.active) : undefined,
  };
}

function buildProductPayload(product: Omit<Product, "id" | "active">) {
  return {
    code: product.code.trim().toUpperCase(),
    product_type: assertProductType(product.product_type),
    stock: Number(product.stock),
    stock_minimum: Number(product.stock_minimum),
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.active !== undefined) params.set("active", String(filters.active));
  if (filters.search) params.set("search", filters.search);
  if (filters.type) params.set("type", normalizeProductType(filters.type));
  const query = params.toString();

  const data = await apiFetch<Product[] | { products?: Product[] } | Record<string, unknown>[]>(
    `/supplies/products${query ? `?${query}` : ""}`,
  );

  const list = Array.isArray(data) ? data : (data.products ?? []);
  let products = list.map((item) =>
    normalizeProduct(typeof item === "object" && item != null ? (item as Record<string, unknown>) : {}),
  );

  if (filters.type) {
    const wanted = normalizeProductType(filters.type);
    products = products.filter((p) => normalizeProductType(p.product_type) === wanted);
  }

  return products;
}

export async function getProduct(code: string): Promise<Product> {
  const data = await apiFetch<{ product: Record<string, unknown> } | Record<string, unknown>>(
    `/supplies/products/${encodeURIComponent(code)}`,
  );
  const raw = "product" in data && data.product ? data.product : data;
  return normalizeProduct(raw as Record<string, unknown>);
}

export async function getLowStock(): Promise<Product[]> {
  const data = await apiFetch<{ products?: Record<string, unknown>[] } | Record<string, unknown>[]>(
    "/supplies/products/low-stock",
  );
  const list = Array.isArray(data) ? data : (data.products ?? []);
  return list.map((item) => normalizeProduct(item));
}

export async function createProduct(product: Omit<Product, "id" | "active">) {
  return apiFetch("/supplies/products", {
    method: "POST",
    body: JSON.stringify(buildProductPayload(product)),
  });
}

export async function updateProduct(code: string, data: { code: string; product_type: string }) {
  return apiFetch(`/supplies/products/${encodeURIComponent(code)}`, {
    method: "PUT",
    body: JSON.stringify({
      code: data.code.trim().toUpperCase(),
      product_type: assertProductType(data.product_type),
    }),
  });
}

export async function activateProduct(code: string) {
  return apiFetch(`/supplies/products/${encodeURIComponent(code)}/active`, { method: "PATCH" });
}

export async function deactivateProduct(code: string) {
  return apiFetch(`/supplies/products/${encodeURIComponent(code)}/inactive`, { method: "PATCH" });
}

export async function entryProduct(code: string, movement: { quantity: number; observation?: string }) {
  return apiFetch(`/supplies/products/${encodeURIComponent(code)}/entry`, {
    method: "POST",
    body: JSON.stringify(movement),
  });
}

export async function exitProduct(code: string, movement: { quantity: number; observation?: string }) {
  return apiFetch(`/supplies/products/${encodeURIComponent(code)}/exit`, {
    method: "POST",
    body: JSON.stringify(movement),
  });
}

export async function getProductMovements(code: string): Promise<StockMovement[]> {
  const data = await apiFetch<{ movements?: RawMovement[] } | RawMovement[]>(
    `/supplies/products/${encodeURIComponent(code)}/movements`,
  );
  const list = Array.isArray(data) ? data : (data.movements ?? []);
  return list.map((m) => normalizeMovement(m, { product_code: code }));
}
