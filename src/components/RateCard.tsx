import type { RateRow } from "@/types";
import { formatMoney } from "@/utils/normalize";

function isHaier(company: string): boolean {
  return company.trim().toLowerCase() === "haier";
}

function PriceBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: unknown;
  accent: "red" | "white" | "gold";
}) {
  const accentClasses =
    accent === "red"
      ? "text-red-500"
      : accent === "gold"
      ? "text-amber-400"
      : "text-white";
  const labelBg =
    accent === "red"
      ? "bg-red-600/15 text-red-400 border-red-600/30"
      : accent === "gold"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-white/10 text-neutral-300 border-white/15";

  return (
    <div className="flex-1 min-w-0 bg-black/50 rounded-lg p-2.5 sm:p-3 border border-white/5">
      <div
        className={`inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${labelBg}`}
      >
        {label}
      </div>
      <div className={`mt-1.5 font-black text-base sm:text-lg leading-tight ${accentClasses} tabular-nums`}>
        {formatMoney(value)}
      </div>
    </div>
  );
}

export default function RateCard({ row }: { row: RateRow }) {
  const haier = isHaier(row.company);

  return (
    <article className="group relative bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl border border-white/10 hover:border-red-600/50 transition-all shadow-md hover:shadow-red-900/30 overflow-hidden">
      {/* Top strip */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span
                className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  haier
                    ? "bg-red-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {row.company}
              </span>
              {row.product && (
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10">
                  {row.product}
                </span>
              )}
              {haier && (
                <span className="inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  3-Tier
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-sm sm:text-base leading-tight break-words">
              {row.model}
            </h3>
          </div>
        </div>

        {/* Price grid */}
        <div className={`grid gap-2 mt-3 ${haier ? "grid-cols-3" : "grid-cols-2"}`}>
          <PriceBlock label="Cash" value={row.cash} accent="red" />
          <PriceBlock label="Installment" value={row.installment} accent="white" />
          {haier && <PriceBlock label="Fixed" value={row.fixed} accent="gold" />}
        </div>

        {/* Remarks - only shown if present */}
        {row.remarks && row.remarks.trim() !== "" && (
          <div className="mt-3 flex items-start gap-1.5 bg-red-600/5 border border-red-600/20 rounded-lg px-2.5 py-1.5">
            <svg
              className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[11px] sm:text-xs text-neutral-200 leading-snug">
              {row.remarks}
            </span>
          </div>
        )}

        {/* Footer: Month/Year */}
        {(row.month || row.year) && (
          <div className="mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 font-semibold">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {[row.month, row.year].filter(Boolean).join(" ")}
            </span>
            <span className="uppercase tracking-wider text-neutral-600">Rate Card</span>
          </div>
        )}
      </div>
    </article>
  );
}
