const APP_TIMEZONE = "America/Sao_Paulo";

/** API devolve UTC sem offset; tratar como UTC antes de exibir no fuso BR. */
export function parseApiDateTime(value: string): Date {
  const trimmed = value.trim();
  if (!trimmed) return new Date(NaN);

  if (/[zZ]$/.test(trimmed) || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }

  const normalized = trimmed.includes(" ") ? trimmed.replace(" ", "T") : trimmed;
  const withoutExtraMicros = normalized.replace(/(\.\d{3})\d+/, "$1");
  return new Date(`${withoutExtraMicros}Z`);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = parseApiDateTime(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIMEZONE,
  });
}

export function toTimestamp(value?: string | null): number {
  if (!value) return 0;
  const time = parseApiDateTime(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}
