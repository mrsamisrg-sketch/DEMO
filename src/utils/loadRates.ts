import * as XLSX from "xlsx";
import type { RateRow } from "@/types";

// Normalize header key: lowercase, alphanumeric only.
function keyNorm(s: string): string {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Map several possible column names to our canonical fields.
const FIELD_MAP: Record<string, keyof RateRow> = {
  company: "company",
  brand: "company",
  make: "company",

  product: "product",
  category: "product",
  type: "product",
  producttype: "product",

  model: "model",
  modelno: "model",
  modelnumber: "model",
  modelname: "model",

  cash: "cash",
  cashrate: "cash",
  cashprice: "cash",

  installment: "installment",
  installmentrate: "installment",
  installmentprice: "installment",
  emi: "installment",
  qist: "installment",

  fixed: "fixed",
  fixedrate: "fixed",
  fixedprice: "fixed",
  fix: "fixed",
  fixrate: "fixed",

  remark: "remarks",
  remarks: "remarks",
  note: "remarks",
  notes: "remarks",
  comment: "remarks",
  comments: "remarks",

  month: "month",
  year: "year",
  date: "month", // will be split
};

function parseRow(raw: Record<string, unknown>): RateRow | null {
  const out: Partial<RateRow> = {};
  for (const [k, v] of Object.entries(raw)) {
    const nk = keyNorm(k);
    const target = FIELD_MAP[nk];
    if (!target) continue;
    if (v === null || v === undefined || v === "") continue;
    (out as Record<string, unknown>)[target] = v;
  }
  if (!out.company || !out.model) return null;

  // Coerce numbers for price fields
  for (const f of ["cash", "installment", "fixed"] as const) {
    const val = out[f];
    if (val === undefined || val === null || val === "") continue;
    if (typeof val === "number") continue;
    const num = Number(String(val).replace(/[^0-9.-]/g, ""));
    if (isFinite(num)) out[f] = num;
  }

  return {
    company: String(out.company).trim(),
    product: String(out.product ?? "General").trim(),
    model: String(out.model).trim(),
    cash: out.cash,
    installment: out.installment,
    fixed: out.fixed,
    remarks: out.remarks ? String(out.remarks).trim() : "",
    month: out.month ? String(out.month).trim() : "",
    year: out.year ?? "",
  };
}

export interface LoadResult {
  rows: RateRow[];
  source: "xlsx" | "sample";
  error?: string;
  updatedLabel?: string;
}

export async function loadRatesFromXlsx(url = "./rates.xlsx"): Promise<{
  rows: RateRow[];
  updatedLabel?: string;
}> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const rows: RateRow[] = [];
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
      raw: true,
    });
    for (const r of json) {
      const parsed = parseRow(r);
      if (parsed) rows.push(parsed);
    }
  }

  // Determine the most recent month/year label from data
  let updatedLabel: string | undefined;
  const years = rows
    .map((r) => Number(r.year))
    .filter((n) => isFinite(n) && n > 0);
  const months = rows.map((r) => r.month).filter(Boolean) as string[];
  if (years.length) {
    const maxYear = Math.max(...years);
    const monthForYear = rows.find((r) => Number(r.year) === maxYear)?.month;
    updatedLabel = `${monthForYear ?? ""} ${maxYear}`.trim();
  } else if (months.length) {
    updatedLabel = months[0];
  }

  return { rows, updatedLabel };
}
