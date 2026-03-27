import { FormEvent, useMemo, useState } from "react";
import { login } from "./lib/api";
import { UserSession } from "./types";
import { Layout } from "./components/layout/Layout";
import { AppPage } from "./components/layout/Sidebar";
import { Calendar } from "./pages/Calendar";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { Users } from "./pages/Users";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";

export function App() {
  const [page, setPage] = useState<AppPage>("dashboard");
  const [session, setSession] = useState<UserSession | null>(null);
  const [loginForm, setLoginForm] = useState({ clientName: "", password: "" });
  const [authError, setAuthError] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    try {
      const user = await login(loginForm.clientName, loginForm.password);
      setSession(user);
      setAuthError("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Falha no login");
    }
  }

  const content = useMemo(() => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "calendar":
        return <Calendar />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }, [page]);

  const title = useMemo(() => {
    switch (page) {
      case "dashboard":
        return "Dashboard";
      case "users":
        return "Members";
      case "calendar":
        return "Calendar";
      case "settings":
        return "Meeting Minutes";
      default:
        return "Dashboard";
    }
  }, [page]);

  if (!session) {
    return (
      <main className="grid min-h-screen place-content-center bg-slate-100 p-4">
        <Card className="w-full max-w-md space-y-6 p-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Clemens Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Entre com Nome do Cliente e Senha</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Nome do Cliente</span>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                value={loginForm.clientName}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Senha</span>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </label>
            <Button className="w-full">Entrar</Button>
          </form>

          {authError && <p className="text-sm text-rose-600">{authError}</p>}
        </Card>
      </main>
    );
  }

  return (
    <Layout activePage={page} onNavigate={setPage} title={title} user={session} onLogout={() => setSession(null)}>
      {content}
    </Layout>
  );
}
