import { ShieldCheck, User, FileText, Pencil, LogIn, Plus } from "lucide-react";

const logs = [
  { icon: LogIn, who: "Delegado Alves", what: "Entrou no sistema", when: "agora", tone: "primary" },
  { icon: Plus, who: "Delegado Alves", what: "Cadastrou inquérito 29777/2026", when: "há 12 min", tone: "primary" },
  { icon: Pencil, who: "Adrieli Souza", what: "Atualizou status de diligências em 32786/2026", when: "há 1 h", tone: "info" },
  { icon: FileText, who: "Sistema", what: "Relatório enviado para 8390/2026", when: "há 3 h", tone: "info" },
  { icon: User, who: "Delegado Alves", what: "Movimentou 25872/2026 para 'Em Andamento'", when: "ontem", tone: "warning" },
];

export default function Auditoria() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-tight">Auditoria</h1></div>
        <p className="mt-1 text-sm text-muted-foreground">Histórico de ações realizadas no sistema</p>
      </div>

      <div className="panel">
        <ol className="relative ml-3 space-y-5 border-l border-border pl-6">
          {logs.map((l, i) => {
            const Icon = l.icon;
            return (
              <li key={i} className="relative">
                <span className="absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-card"
                  style={{ color: `hsl(var(--${l.tone}))` }}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm"><span className="font-semibold">{l.who}</span> <span className="text-muted-foreground">— {l.what}</span></p>
                  <span className="text-xs text-muted-foreground">{l.when}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
