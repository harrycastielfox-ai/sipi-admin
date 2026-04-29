import { AlertTriangle, Clock, Calendar, Bell } from "lucide-react";
import { inqueritosStore } from "@/lib/inqueritos";

const items = [
  { icon: AlertTriangle, color: "destructive", title: "12 inquéritos vencidos", desc: "Prazo de conclusão expirado. Ação imediata necessária.", when: "Agora" },
  { icon: Clock, color: "warning", title: "7 inquéritos sem atualização há mais de 15 dias", desc: "Equipes 1 e 2 com pendências.", when: "Há 2 horas" },
  { icon: Calendar, color: "primary", title: "23 inquéritos sem prazo definido", desc: "Defina datas-limite para acompanhamento.", when: "Há 4 horas" },
  { icon: Bell, color: "info", title: "3 inquéritos próximos do vencimento (≤ 5 dias)", desc: "Confira a lista de casos críticos.", when: "Há 6 horas" },
];

export default function Alertas() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-tight">Alertas</h1></div>
        <p className="mt-1 text-sm text-muted-foreground">Notificações operacionais em tempo real</p>
      </div>

      <ul className="space-y-3">
        {items.map((a, i) => {
          const Icon = a.icon;
          return (
            <li key={i} className="panel flex items-start gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-background/40`}
                style={{ borderColor: `hsl(var(--${a.color}) / 0.4)`, color: `hsl(var(--${a.color}))` }}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold" style={{ color: `hsl(var(--${a.color}))` }}>{a.title}</p>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
