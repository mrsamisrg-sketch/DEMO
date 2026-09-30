import { useEffect, useRef, useState } from "react";

interface Props {
  updatedLabel?: string;
  source: "xlsx" | "sample";
  onLogout: () => void;
  onRefresh: () => void;
  refreshing?: boolean;
}

export default function Header({
  updatedLabel,
  source,
  onLogout,
  onRefresh,
  refreshing,
}: Props) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 20) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="bg-black/95 backdrop-blur-md border-b border-red-600/30 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md shadow-red-700/40 flex-shrink-0">
              <span className="text-white font-black text-xs sm:text-sm">QGE</span>
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-sm sm:text-base leading-tight truncate">
                Qaiser Group of Electronics
              </div>
              <div className="text-red-500 text-[10px] sm:text-[11px] uppercase tracking-wider leading-tight font-semibold">
                Rates Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {updatedLabel && (
              <div className="hidden sm:flex items-center gap-1.5 bg-red-600/15 border border-red-600/40 rounded-full px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-300 text-xs font-semibold">
                  {updatedLabel}
                </span>
              </div>
            )}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              title="Reload rates from rates.xlsx"
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-60"
            >
              <svg
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Small info strip if using sample data */}
        {source === "sample" && (
          <div className="bg-yellow-500/10 border-t border-yellow-500/30 text-yellow-300 text-[11px] sm:text-xs text-center py-1 px-3">
            Showing sample data. Place your <code className="font-mono">rates.xlsx</code> next to
            <code className="font-mono"> index.html</code> in the GitHub repo to see live rates.
          </div>
        )}
      </div>
    </header>
  );
}
