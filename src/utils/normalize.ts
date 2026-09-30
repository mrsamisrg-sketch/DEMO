// Normalize a string for fuzzy matching.
// Removes spaces, dashes, underscores, slashes, dots and lowercases.
export function normalize(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .toLowerCase()
    .replace(/[\s\-_/.\\,()]+/g, "")
    .trim();
}

// Match if every token in `query` is contained in the normalized haystack.
// Also supports splitting query by whitespace so "led 43" matches "LED-43UHD".
export function fuzzyMatch(haystack: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;

  const nHay = normalize(haystack);
  const nQueryFull = normalize(q);
  if (nHay.includes(nQueryFull)) return true;

  // Token-based fallback
  const tokens = q.split(/\s+/).map(normalize).filter(Boolean);
  return tokens.every((t) => nHay.includes(t));
}

// Format money in PKR-style with commas.
export function formatMoney(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
  if (!isFinite(num) || num === 0) return "—";
  return new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(num);
}
