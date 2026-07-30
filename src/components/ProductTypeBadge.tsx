import { getProductTypeLabel, normalizeProductType } from "../constants/products";

interface ProductTypeBadgeProps {
  value: unknown;
}

export function ProductTypeBadge({ value }: ProductTypeBadgeProps) {
  const normalized = normalizeProductType(value);
  const label = getProductTypeLabel(value);

  if (!normalized) {
    return <span className="muted">—</span>;
  }

  return (
    <span className={`type-badge type-${normalized}`}>
      {label}
    </span>
  );
}
