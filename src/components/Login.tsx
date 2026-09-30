import { useState } from "react";

interface Props {
  onLogin: () => void;
}

const USERNAME = "QGE@1983";
const PASSWORD = "QGE@1122";

export default function Login({ onLogin }: Props) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (u.trim() === USERNAME && p === PASSWORD) {
      localStorage.setItem("qge_auth", "1");
      onLogin();
    } else {
      setErr("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 bg-black overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-red-600 blur-3xl opacity-40" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-red-700 blur-3xl opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-600/40 ring-1 ring-white/10">
            <span className="text-white font-black text-2xl tracking-tight">QGE</span>
          </div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
            Qaiser Group of Electronics
          </h1>
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mt-1">
            Salesman Rates Portal
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-neutral-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <h2 className="text-white font-semibold text-lg mb-1">Sign in</h2>
          <p className="text-neutral-400 text-sm mb-6">
            Authorised personnel only.
          </p>

          <label className="block mb-4">
            <span className="text-neutral-300 text-xs font-semibold uppercase tracking-wider">
              Username
            </span>
            <input
              type="text"
              autoComplete="username"
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="mt-1 w-full bg-black/60 border border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 text-white rounded-lg px-3 py-2.5 outline-none transition"
              placeholder="Enter username"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-neutral-300 text-xs font-semibold uppercase tracking-wider">
              Password
            </span>
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                className="w-full bg-black/60 border border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 text-white rounded-lg px-3 py-2.5 pr-16 outline-none transition"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-red-500 font-semibold px-2 py-1"
              >
                {showPw ? "HIDE" : "SHOW"}
              </button>
            </div>
          </label>

          {err && (
            <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 text-red-400 text-sm px-3 py-2">
              {err}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-red-700/30 transition active:scale-[0.98]"
          >
            Sign In
          </button>

          <p className="text-neutral-500 text-xs mt-6 text-center">
            © {new Date().getFullYear()} Qaiser Group of Electronics
          </p>
        </form>
      </div>
    </div>
  );
}
