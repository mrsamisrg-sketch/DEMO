import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import FilterDropdown from "./FilterDropdown";
import RateCard from "./RateCard";
import { loadRatesFromXlsx } from "@/utils/loadRates";
import { SAMPLE_RATES } from "@/data/sampleRates";
import type { RateRow } from "@/types";
import { fuzzyMatch } from "@/utils/normalize";

interface Props {
  onLogout: () => void;
}

export default function Portal({ onLogout }: Props) {
  const [rows, setRows] = useState<RateRow[]>([]);
  const [source, setSource] = useState<"xlsx" | "sample">("sample");
  const [updatedLabel, setUpdatedLabel] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [q, setQ] = useState("");
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { rows: r, updatedLabel: u } = await loadRatesFromXlsx();
      if (r.length > 0) {
        setRows(r);
        setSource("xlsx");
        setUpdatedLabel(u);
      } else {
        throw new Error("empty");
      }
    } catch {
      setRows(SAMPLE_RATES);
      setSource("sample");
      setUpdatedLabel("January 2026 (demo)");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companies = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.company && set.add(r.company));
    return Array.from(set).sort((a, b) => {
      // Haier always first
      if (a.toLowerCase() === "haier") return -1;
      if (b.toLowerCase() === "haier") return 1;
      return a.localeCompare(b);
    });
  }, [rows]);

  const products = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (!company || r.company === company) {
        if (r.product) set.add(r.product);
      }
    });
    return Array.from(set).sort();
  }, [rows, company]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (company && r.company !== company) return false;
      if (product && r.product !== product) return false;
      if (q.trim()) {
        const combined = `${r.company} ${r.product} ${r.model} ${r.remarks ?? ""}`;
        if (!fuzzyMatch(combined, q)) return false;
      }
      return true;
    });
  }, [rows, company, product, q]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header
        updatedLabel={updatedLabel}
        source={source}
        onLogout={onLogout}
        onRefresh={() => {
          setRefreshing(true);
          load();
        }}
        refreshing={refreshing}
      />

      {/* Spacer for fixed header */}
      <div className="h-12 sm:h-14" />
      {source === "sample" && <div className="h-6" />}

      {/* Search + Filters (sticky-ish under header, but scrolls away with content) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search model, company or product... (e.g. 'led 43' or 'h43k')"
            className="w-full bg-neutral-900 border border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 text-white rounded-xl pl-10 sm:pl-11 pr-10 py-3 sm:py-3.5 outline-none transition placeholder:text-neutral-500 text-sm sm:text-base"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-white/10 text-neutral-400 flex items-center justify-center"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>

        {/* Two filters in one line */}
        <div className="mt-3 flex gap-2 sm:gap-3">
          <FilterDropdown
            label="Company"
            value={company}
            options={companies}
            onChange={(v) => {
              setCompany(v);
              // Reset product if it no longer belongs to new company
              if (v && product) {
                const stillValid = rows.some(
                  (r) => r.company === v && r.product === product
                );
                if (!stillValid) setProduct("");
              }
            }}
            icon={
              <svg className="h-4 w-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" />
              </svg>
            }
          />
          <FilterDropdown
            label="Product"
            value={product}
            options={products}
            onChange={setProduct}
            icon={
              <svg className="h-4 w-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            }
          />
        </div>

        {/* Active-filter chips + counts */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400">
            Showing <span className="text-white font-bold">{filtered.length}</span> of{" "}
            <span className="text-white font-bold">{rows.length}</span> rates
          </span>
          {(company || product || q) && (
            <button
              onClick={() => {
                setCompany("");
                setProduct("");
                setQ("");
              }}
              className="ml-auto text-red-400 hover:text-red-300 font-semibold underline underline-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {/* Cards grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 pb-24">
        {loading ? (
          <LoadingGrid />
        ) : filtered.length === 0 ? (
          <EmptyState
            onReset={() => {
              setQ("");
              setCompany("");
              setProduct("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((row, i) => (
              <RateCard key={`${row.company}-${row.model}-${i}`} row={row} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 bg-black py-5 text-center text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="mb-1 font-semibold text-neutral-400">
            Qaiser Group of Electronics — Salesman Rates Portal
          </div>
          <div>
            Rates are updated monthly via <code className="text-red-400">rates.xlsx</code>.
            For internal use only.
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-56 rounded-xl bg-neutral-900 border border-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="mx-auto h-16 w-16 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-4">
        <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h3 className="text-white font-bold text-lg">No rates found</h3>
      <p className="text-neutral-400 text-sm mt-1">
        Try a different keyword or clear the filters.
      </p>
      <button
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold"
      >
        Reset filters
      </button>
    </div>
  );
}
