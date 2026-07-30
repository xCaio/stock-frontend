export const PRODUCT_TYPES = [
  { value: "etiqueta", label: "Etiqueta" },
  { value: "ribbon", label: "Ribbon" },
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number]["value"];

const ALLOWED = new Set<string>(PRODUCT_TYPES.map((t) => t.value));

export function normalizeProductType(value: unknown): ProductType | "" {
  if (value == null || value === "") return "";
  const normalized = String(value).toLowerCase().trim();
  if (normalized === "etiquetas") return "etiqueta";
  if (normalized === "ribbons") return "ribbon";
  if (ALLOWED.has(normalized)) return normalized as ProductType;
  return "";
}

export function getProductTypeLabel(value: unknown): string {
  const normalized = normalizeProductType(value);
  return PRODUCT_TYPES.find((t) => t.value === normalized)?.label ?? (normalized || "—");
}

export function assertProductType(value: unknown): ProductType {
  const normalized = normalizeProductType(value);
  if (!normalized) {
    throw new Error('Selecione um tipo válido: "Etiqueta" ou "Ribbon".');
  }
  return normalized;
}

export function matchesProductType(productType: unknown, filter: string): boolean {
  if (!filter) return true;
  return normalizeProductType(productType) === normalizeProductType(filter);
}
