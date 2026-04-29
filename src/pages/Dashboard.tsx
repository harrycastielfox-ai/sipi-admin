import { useMemo } from "react";
import { inqueritosStore } from "@/lib/inqueritos";
import { FileText, Clock, CheckCircle2, TrendingUp, AlertTriangle, ShieldAlert, Stethoscope, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const tone = {
  primary: "from-primary/20 to-primary/5 text-primary border-primary/30",
  info: "from-info/20 to-info/5 text-info border-info/30",
  warning: "from-warning/20 to-warning/5 text-warning border-warning/30",
  danger: "from-destructive/25 to-destructive/5 text-destructive border-destructive/30",
  violet: "from-[hsl(270_70%_60%/0.2)] to-[hsl(270_70%_60%/0.05)] text-[hsl(270_80%_75%)] border-[hsl(270_70%_60%/0.3)]",
} as const;

function StatCard({ label, value, hint, icon: Icon, t }: any) {
  return (
    <div className={`stat-card`}>
      <div className="flex items-start justify-between">
        <p className="label-eyebrow">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-br ${tone[t as keyof typeof tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={`mt-3 text-4xl font-extrabold tracking-tight ${t==='danger'?'text-destructive':t==='warning'?'text-warning':t==='info'?'text-info':'text-primary'}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function Dashboard() {
  const list = inqueritosStore.list();

  const stats = useMemo(() => {
    const total = list.length;
    const andamento = list.filter(i => i.statusDiligencias === "Em Andamento").length;
    const concluidos = list.filter(i => i.statusDiligencias === "Concluída" || i.situacao === "Relatado").length;
    const alta = list.filter(i => i.prioridade === "ALTA").length;
    const critico = list.filter(i => (i.diasCorridos ?? 0) >= (i.prazo ?? 30) - 3).length;
    const presos = list.filter(i => i.reuPreso === "Sim").length;
    const protetiva = list.filter(i => i.medidaProtetiva === "Sim").length;
    return { total, andamento, concluidos, alta, critico, presos, protetiva };
  }, [list]);

  const cvliPend = list.filter(i => i.gravidade === "CVLI" && i.relatorioEnviado !== "Sim").length;
  const sexPend = list.filter(i => i.gravidade === "Crimes Sexuais" && i.relatorioEnviado !== "Sim").length;
  const vdPend = list.filter(i => i.gravidade === "Violência Doméstica" && i.relatorioEnviado !== "Sim").length;

  const porTipo = ["IP", "APF", "TCO", "BOC", "AIAI"].map(t => ({
    t, n: list.filter(i => i.tipo === t).length,
  }));
  const max = Math.max(1, ...porTipo.map(p => p.n));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight">Painel de Controle</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Delegacia Territorial de Itabela — 23ª COORPIN
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
          Atualizado agora
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <StatCard t="primary" icon={FileText} label="Total" value={stats.total} hint="Procedimentos cadastrados" />
        <StatCard t="info" icon={Clock} label="Em andamento" value={stats.andamento} hint={`${Math.round((stats.andamento/Math.max(1,stats.total))*100)}% do total`} />
        <StatCard t="primary" icon={CheckCircle2} label="Concluídos" value={stats.concluidos} hint={`${Math.round((stats.concluidos/Math.max(1,stats.total))*100)}% taxa atual`} />
        <StatCard t="warning" icon={TrendingUp} label="Prior. Alta" value={stats.alta} hint="Requer atenção" />
        <StatCard t="danger" icon={AlertTriangle} label="Prazo crítico" value={stats.critico} hint="< 3 dias" />
        <StatCard t="violet" icon={ShieldAlert} label="Réu Preso" value={stats.presos} hint="Casos com prisão" />
        <StatCard t="warning" icon={Stethoscope} label="Med. protetivas" value={stats.protetiva} hint="Ativas" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="label-eyebrow text-destructive">Alertas críticos</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { t: "Inquéritos em prazo crítico", s: "Menos de 3 dias para vencer", n: stats.critico, c: "destructive" },
              { t: "Casos prioridade ALTA", s: "Demandam ação imediata", n: stats.alta, c: "warning" },
              { t: "CVLI sem relatar", s: "IP de homicídios pendentes", n: cvliPend, c: "destructive" },
              { t: "Crimes Sexuais sem relatar", s: "Aguardando conclusão", n: sexPend, c: "violet" },
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
                <span className={`h-2 w-2 rounded-full bg-${a.c}`} style={{ background: `hsl(var(--${a.c==='violet'?'primary':a.c}))` }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{a.t}</p>
                  <p className="text-xs text-muted-foreground">{a.s}</p>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${a.c==='destructive'?'bg-destructive/15 text-destructive':a.c==='warning'?'bg-warning/15 text-warning':'bg-primary/15 text-primary'}`}>{a.n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3 className="label-eyebrow text-warning border-b border-border pb-3">Pendências por categoria</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ["IP de CVLI sem relatar", cvliPend, "destructive"],
              ["IP de Crimes Sexuais sem relatar", sexPend, "warning"],
              ["IP de Violência Doméstica sem relatar", vdPend, "info"],
              ["APF não relatados", list.filter(i => i.tipo==='APF' && i.relatorioEnviado!=='Sim').length, "primary"],
            ].map(([l, n, c]: any) => (
              <li key={l} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2.5">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: `hsl(var(--${c}))` }} />
                  {l}
                </span>
                <span className="font-bold text-foreground">{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3 className="label-eyebrow text-primary border-b border-border pb-3">Procedimentos por tipo</h3>
          <div className="mt-4 space-y-3">
            {porTipo.map(({ t, n }) => (
              <div key={t}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">{t}</span>
                  <span className="font-bold">{n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all"
                    style={{ width: `${(n/max)*100}%` }} />
                </div>
              </div>
            ))}
            <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">
              IP: Inquéritos · APF: Flagrantes · TCO: Termos · BOC: Boletins · AIAI: Ato Infracional
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="label-eyebrow text-primary">Inquéritos recentes</h3>
          <Link to="/inqueritos" className="text-xs font-semibold text-primary hover:underline">Ver todos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4">PPE</th>
                <th className="py-2 pr-4">Tipificação</th>
                <th className="py-2 pr-4">Vítima</th>
                <th className="py-2 pr-4">Prior.</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Situação</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 8).map(i => (
                <tr key={i.ppe} className="border-b border-border/40 last:border-0 hover:bg-muted/30">
                  <td className="py-2.5 pr-4 font-mono text-primary">{i.ppe}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground line-clamp-1 max-w-md">{i.tipificacao}</td>
                  <td className="py-2.5 pr-4 line-clamp-1 max-w-[200px]">{i.vitima}</td>
                  <td className="py-2.5 pr-4">{i.prioridade}</td>
                  <td className="py-2.5 pr-4">{i.tipo}</td>
                  <td className="py-2.5 pr-4">{i.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
