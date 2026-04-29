import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Gavel, PlusCircle, Bell, ShieldCheck, LogOut, Shield, Activity, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inqueritos", label: "Inquéritos", icon: FileText },
  { to: "/representacoes", label: "Representações", icon: Gavel },
  { to: "/novo-caso", label: "Novo Caso", icon: PlusCircle },
  { to: "/alertas", label: "Alertas", icon: Bell, badge: 5 },
  { to: "/auditoria", label: "Auditoria", icon: ShieldCheck },
];

export default function AppLayout() {
  const nav = useNavigate();
  const session = auth.get();
  function logout() { auth.logout(); nav("/login"); }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <button onClick={() => nav("/modulos")} className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5 text-left transition hover:bg-sidebar-accent">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-sidebar-foreground">SIPI</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Inquéritos Policiais</p>
          </div>
        </button>

        <div className="px-5 pt-5">
          <p className="label-eyebrow text-muted-foreground/70">Módulos</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-3">
          {items.map(it => {
            const Icon = it.icon;
            return (
              <NavLink key={it.to} to={it.to} end
                className={({ isActive }) => cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-primary shadow-inner border border-primary/20"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{it.label}</span>
                    {it.badge && (
                      <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">{it.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {session?.name?.split(" ").map(s => s[0]).slice(0,2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-sidebar-foreground">{session?.name?.toUpperCase()}</p>
              <p className="truncate text-[11px] text-muted-foreground">{session?.email}</p>
            </div>
            <button onClick={logout} title="Sair" className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-primary" />
            <span>Painel Operacional · DT Itabela</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => nav("/novo-caso")} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-elegant)]">
              <Plus className="mr-2 h-4 w-4" /> Novo Inquérito
            </Button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
