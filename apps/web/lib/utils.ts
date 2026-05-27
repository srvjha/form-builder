import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}…`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Escape a CSV cell value — wraps in quotes if it contains commas, quotes, or newlines. */
function csvCell(val: unknown): string {
  const str = val == null ? "" : String(val);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export interface CsvExportField  { id: string; label: string; type: string }
export interface CsvExportAnswer { fieldId: string; value: unknown }
export interface CsvExportRow {
  id: string;
  submittedAt: string | Date;
  respondentEmail?: string | null;
  completionTimeMs?: number | null;
  answers: CsvExportAnswer[];
}

export function buildCsv(fields: CsvExportField[], rows: CsvExportRow[]): string {
  const staticHeaders = ["Response ID", "Submitted At", "Email", "Duration (s)"];
  const fieldHeaders  = fields.map((f) => f.label);
  const header = [...staticHeaders, ...fieldHeaders].map(csvCell).join(",");

  const lines = rows.map((row) => {
    const answerMap = new Map(row.answers.map((a) => [a.fieldId, a.value]));
    const staticCells = [
      row.id,
      new Date(row.submittedAt).toISOString(),
      row.respondentEmail ?? "",
      row.completionTimeMs != null ? Math.round(row.completionTimeMs / 1000) : "",
    ];
    const fieldCells = fields.map((f) => {
      const v = answerMap.get(f.id);
      return Array.isArray(v) ? v.join("; ") : v;
    });
    return [...staticCells, ...fieldCells].map(csvCell).join(",");
  });

  return [header, ...lines].join("\n");
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

