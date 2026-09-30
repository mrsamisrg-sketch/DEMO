import { useEffect, useState } from "react";
import Login from "./components/Login";
import Portal from "./components/Portal";

export default function App() {
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("qge_auth") === "1");
  }, []);

  function logout() {
    localStorage.removeItem("qge_auth");
    setAuthed(false);
  }

  return authed ? (
    <Portal onLogout={logout} />
  ) : (
    <Login onLogin={() => setAuthed(true)} />
  );
}
