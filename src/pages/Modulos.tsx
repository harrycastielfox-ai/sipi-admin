import { useNavigate } from "react-router-dom";
import { FileText, Car, Package, Shield, LogOut, ArrowRight, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type Mod = {
  id: string; title: string; desc: string; icon: any;
  route?: string; soon?: boolean; accent: string;
};

const modulos: Mod[] = [
  { id: "inq", title: "INQUÉRITOS", desc: "IP, APF, TCO, BOC e AIAI — controle de prazos, situações e equipes.", icon: FileText, route: "/dashboard", accent: "from-primary/30 to-primary/5" },
  { id: "vei", title: "VEÍCULOS APREENDIDOS", desc: "Registro de veículos apreendidos, vínculo a procedimentos e devoluções.", icon: Car, soon: true, accent: "from-info/30 to-info/5" },
  { id: "obj", title: "OBJETOS APREENDIDOS", desc: "Cadastro e rastreio de objetos apreendidos vinculados a casos.", icon: Package, soon: true, accent: "from-warning/30 to-warning/5" },
];

export default function Modulos() {
  const nav = useNavigate();
  const session = auth.get();

  function logout() { auth.logout(); nav("/login"); }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">SIPI</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Sistema de Inquéritos Policiais</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold">{session?.name}</p>
              <p className="text-[11px] text-muted-foreground">{session?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 animate-fade-in">
          <p className="label-eyebrow text-primary">Painel Inicial</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Módulos do Sistema</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Selecione um módulo para acessar suas funcionalidades.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modulos.map((m, i) => {
            const Icon = m.icon;
            const clickable = !m.soon;
            return (
              <button
                key={m.id}
                disabled={!clickable}
                onClick={() => clickable && m.route && nav(m.route)}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 text-left animate-fade-in transition-all
                  ${clickable ? "hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-elegant)] cursor-pointer" : "opacity-90 cursor-not-allowed"}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.accent} opacity-60`} />
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-background/60 shadow-inner">
                      <Icon className="h-7 w-7 text-primary" strokeWidth={1.8} />
                    </div>
                    {m.soon ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-warning">
                        <Clock className="h-3 w-3" /> Em breve
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                        Disponível
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-extrabold tracking-tight">{m.title}</h2>
                  <p className="mt-2 min-h-[3.5rem] text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                  {clickable && (
                    <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-80 transition group-hover:opacity-100">
                      Acessar módulo <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
