import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  value: string; // "" means "All"
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const display = value || `All ${label}s`;

  return (
    <div ref={rootRef} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition text-left ${
          open
            ? "bg-black border-red-500 ring-2 ring-red-500/30"
            : "bg-neutral-900 border-white/10 hover:border-red-600/50"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold leading-none">
              {label}
            </div>
            <div className="text-white text-sm font-semibold truncate mt-0.5">
              {display}
            </div>
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-neutral-400 transition-transform flex-shrink-0 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-neutral-950 border border-white/10 rounded-lg shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full bg-black/60 border border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 text-white text-sm rounded-md px-2.5 py-1.5 outline-none"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
                setQuery("");
              }}
              className={`w-full text-left px-3 py-2 text-sm transition flex items-center justify-between ${
                value === ""
                  ? "bg-red-600/20 text-red-300 font-semibold"
                  : "text-neutral-200 hover:bg-white/5"
              }`}
            >
              <span>All {label}s</span>
              {value === "" && <span className="text-red-500">✓</span>}
            </button>
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-neutral-500 text-center">
                No matches
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition flex items-center justify-between ${
                    value === opt
                      ? "bg-red-600/20 text-red-300 font-semibold"
                      : "text-neutral-200 hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {value === opt && (
                    <span className="text-red-500 flex-shrink-0 ml-2">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
