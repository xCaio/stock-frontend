interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "default" | "warning" | "success";
}

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}

interface AlertProps {
  type?: "error" | "success" | "info";
  children: React.ReactNode;
}

export function Alert({ type = "error", children }: AlertProps) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

interface NumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  placeholder?: string;
  required?: boolean;
}

/** Campo numérico controlado como string — permite apagar e digitar sem ficar preso no 0 */
export function NumberField({
  value,
  onChange,
  min = 0,
  placeholder = "0",
  required,
}: NumberFieldProps) {
  return (
    <input
      type="number"
      min={min}
      inputMode="numeric"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  );
}

export function parseRequiredInt(value: string, label: string, min = 0): number {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Informe ${label.toLowerCase()}.`);
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < min) {
    throw new Error(`${label} deve ser um número inteiro${min > 0 ? ` maior que ${min - 1}` : " positivo"}.`);
  }
  return parsed;
}
