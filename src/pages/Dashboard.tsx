import { useMemo } from "react";
import { inqueritosStore } from "@/lib/inqueritos";
import {
  FileText, Clock, CheckCircle2, TrendingUp, AlertTriangle,
  ShieldAlert, Stethoscope, Activity, Plus, Filter, Bell, Users, MapPin,
  Gauge, Timer, Flame, Server, Wifi, Database, ShieldCheck, UserCog, CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ComposedChart, Line,
} from "recharts";

const ACCENTS: Record<string, { color: string; glow: string; text: string }> = {
  primary: { color: "hsl(152 76% 44%)", glow: "hsl(152 76% 44% / 0.18)", text: "text-primary" },
  info:    { color: "hsl(199 89% 55%)", glow: "hsl(199 89% 55% / 0.18)", text: "text-info" },
  warning: { color: "hsl(38 92% 55%)",  glow: "hsl(38 92% 55% / 0.18)",  text: "text-warning" },
  danger:  { color: "hsl(0 75% 55%)",   glow: "hsl(0 75% 55% / 0.20)",   text: "text-destructive" },
  violet:  { color: "hsl(270 70% 60%)", glow: "hsl(270 70% 60% / 0.20)", text: "text-[hsl(270_80%_75%)]" },
};

function StatCard({ label, value, hint, icon: Icon, t }: any) {
  const a = ACCENTS[t] ?? ACCENTS.primary;
  return (
    <div
      className="kpi-card group"
      style={{ ["--kpi-accent" as any]: a.color, ["--kpi-glow" as any]: a.glow }}
    >
      <div className="relative flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <div className="kpi-icon transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={`relative mt-4 text-[2.6rem] font-extrabold leading-none tracking-tight tabular-nums ${a.text}`}
         style={{ textShadow: `0 0 24px ${a.glow}` }}>
        {value}
      </p>
      <p className="relative mt-2 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

const COLORS = {
  primary: "hsl(152 76% 44%)",
  info: "hsl(199 89% 55%)",
  warning: "hsl(38 92% 55%)",
  danger: "hsl(0 75% 55%)",
  violet: "hsl(270 70% 60%)",
  muted: "hsl(215 14% 40%)",
};

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
  const apfPend = list.filter(i => i.tipo === "APF" && i.relatorioEnviado !== "Sim").length;

  // Por status diligência (donut)
  const statusKeys = ["Concluída", "Pendente", "Em Andamento", "Aguardando Terceiros", "Aguardando Aprovação/Revisão"];
  const statusData = statusKeys.map((k, idx) => ({
    name: k === "Aguardando Aprovação/Revisão" ? "Aguard. Aprovação" : k,
    value: list.filter(i => i.statusDiligencias === k).length,
    color: [COLORS.primary, COLORS.warning, COLORS.info, COLORS.violet, COLORS.danger][idx],
  })).filter(d => d.value > 0);
  const statusTotal = statusData.reduce((a, b) => a + b.value, 0);

  // Por prioridade (donut)
  const prioData = [
    { name: "Alta", value: list.filter(i => i.prioridade === "ALTA").length, color: COLORS.danger },
    { name: "Média", value: list.filter(i => i.prioridade === "MÉDIA").length, color: COLORS.warning },
    { name: "Baixa", value: list.filter(i => i.prioridade === "BAIXA").length, color: COLORS.info },
  ].filter(d => d.value > 0);
  const prioTotal = prioData.reduce((a, b) => a + b.value, 0);

  // Procedimentos por tipo
  const porTipo = ["IP", "APF", "TCO", "BOC", "AIAI"].map(t => ({
    t, n: list.filter(i => i.tipo === t).length,
  }));
  const maxTipo = Math.max(1, ...porTipo.map(p => p.n));

  // Meta de conclusão
  const taxa = stats.total ? (stats.concluidos / stats.total) * 100 : 0;
  const relatados = list.filter(i => i.relatorioEnviado === "Sim").length;
  const naoEnviados = list.filter(i => i.situacao === "Relatado" && i.relatorioEnviado !== "Sim").length;

  // CVLI anual
  const yearOf = (d?: string | null) => d ? new Date(d).getFullYear() : null;
  const cvliList = list.filter(i => i.gravidade === "CVLI");
  const years = [2023, 2024, 2025, 2026];
  const cvliAnual = years.map(y => {
    const reg = cvliList.filter(i => yearOf(i.dataFato) === y).length;
    const eluc = cvliList.filter(i => yearOf(i.dataFato) === y && (i.statusDiligencias === "Concluída" || i.situacao === "Relatado")).length;
    return { ano: String(y), reg, eluc, taxa: reg ? Math.round((eluc / reg) * 1000) / 10 : 0 };
  });
  const cvliTotal = cvliAnual.reduce((a, b) => ({
    reg: a.reg + b.reg, eluc: a.eluc + b.eluc,
  }), { reg: 0, eluc: 0 });
  const cvliTotalPct = cvliTotal.reg ? Math.round((cvliTotal.eluc / cvliTotal.reg) * 1000) / 10 : 0;

  // Mensal CVLI
  const monthsLbl = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const cvliMensal = monthsLbl.map((m, idx) => {
    const inMonth = cvliList.filter(i => i.dataFato && new Date(i.dataFato).getMonth() === idx);
    return {
      m,
      "2023": inMonth.filter(i => yearOf(i.dataFato) === 2023).length,
      "2024": inMonth.filter(i => yearOf(i.dataFato) === 2024).length,
      "2025": inMonth.filter(i => yearOf(i.dataFato) === 2025).length,
      "2026": inMonth.filter(i => yearOf(i.dataFato) === 2026).length,
    };
  });

  // Localidade
  const bairros = Array.from(new Set(list.map(i => i.bairro).filter(Boolean)));
  const porBairro = bairros.map(b => ({
    bairro: b,
    total: list.filter(i => i.bairro === b).length,
    cvli: list.filter(i => i.bairro === b && i.gravidade === "CVLI").length,
    alta: list.filter(i => i.bairro === b && i.prioridade === "ALTA").length,
  })).sort((a, b) => b.total - a.total);

  // Gravidade
  const gravKeys = ["CVLI","Crimes Contra o Patrimônio","Outro","Violência Doméstica","Violento","Crimes de Trânsito","Crimes Sexuais","MIAE","Drogas","Violência contra a Criança e o Adolescente"];
  const porGrav = gravKeys.map(g => ({
    g: g.replace("Crimes Contra o Patrimônio","Crimes Patrimoniais")
       .replace("Violência contra a Criança e o Adolescente","Vio. Criança/Adolesc."),
    n: list.filter(i => i.gravidade === g).length,
  })).filter(x => x.n > 0).sort((a, b) => b.n - a.n);

  // Equipes
  const eqs = Array.from(new Set(list.map(i => i.equipe || "DT Itabela (Geral)")));
  const porEquipe = eqs.map(e => ({
    e: e || "DT Itabela (Geral)",
    n: list.filter(i => (i.equipe || "DT Itabela (Geral)") === e).length,
  })).sort((a, b) => b.n - a.n);
  const eqTotal = porEquipe.reduce((a, b) => a + b.n, 0);

  const now = new Date();
  const dt = now.toLocaleDateString("pt-BR");
  const tm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // Produtividade 7d / 30d
  const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
  const inRange = (d: string | null | undefined, n: number) => !!d && new Date(d) >= daysAgo(n);
  const novos7 = list.filter(i => inRange(i.dataInstauracao, 7)).length;
  const novos30 = list.filter(i => inRange(i.dataInstauracao, 30)).length;
  const concl7 = list.filter(i => inRange(i.ultimaAtualizacao, 7) && (i.statusDiligencias === "Concluída" || i.situacao === "Relatado")).length;
  const concl30 = list.filter(i => inRange(i.ultimaAtualizacao, 30) && (i.statusDiligencias === "Concluída" || i.situacao === "Relatado")).length;
  const tempoMedio = (() => {
    const arr = list.map(i => i.diasCorridos ?? 0).filter(n => n > 0);
    return arr.length ? Math.round(arr.reduce((a,b)=>a+b,0) / arr.length) : 0;
  })();
  const noPrazo = list.filter(i => (i.diasCorridos ?? 0) < (i.prazo ?? 30)).length;
  const slaPct = stats.total ? Math.round((noPrazo / stats.total) * 100) : 0;

  // Carga por dia da semana
  const wdLbl = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const cargaSemana = wdLbl.map((w, idx) => ({
    w, n: list.filter(i => i.dataInstauracao && new Date(i.dataInstauracao).getDay() === idx).length,
  }));
  const maxCarga = Math.max(1, ...cargaSemana.map(c => c.n));

  // Ranking de escrivães
  const escs = Array.from(new Set(list.map(i => i.escrivao).filter(Boolean))) as string[];
  const ranking = escs.map(e => {
    const dele = list.filter(i => i.escrivao === e);
    const conc = dele.filter(i => i.statusDiligencias === "Concluída" || i.situacao === "Relatado").length;
    const crit = dele.filter(i => (i.diasCorridos ?? 0) >= (i.prazo ?? 30) - 3).length;
    return { e, total: dele.length, conc, crit, taxa: dele.length ? Math.round((conc/dele.length)*100) : 0 };
  }).sort((a,b)=>b.total-a.total).slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header (sem caixa) */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="header-accent">
          <div className="flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Painel de Controle
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Delegacia Territorial de Itabela — 23ª COORPIN — atualizado em {dt} às {tm}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/novo-caso"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.7)] ring-1 ring-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" /> Novo Inquérito
          </Link>
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:scale-[1.02] hover:border-primary/50 active:scale-[0.98]">
            <Filter className="h-4 w-4" /> Filtros Rápidos
          </button>
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Atualizado: {dt}, {tm}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
        <StatCard t="primary" icon={FileText} label="Total" value={stats.total} hint="Procedimentos cadastrados" />
        <StatCard t="info" icon={Clock} label="Em andamento" value={stats.andamento} hint={`${Math.round((stats.andamento/Math.max(1,stats.total))*100)}% do total`} />
        <StatCard t="primary" icon={CheckCircle2} label="Concluídos" value={stats.concluidos} hint={`${(taxa).toFixed(2)}% taxa atual`} />
        <StatCard t="warning" icon={TrendingUp} label="Prior. Alta" value={stats.alta} hint="Requer atenção" />
        <StatCard t="danger" icon={AlertTriangle} label="Prazo crítico" value={stats.critico} hint="< 3 dias" />
        <StatCard t="violet" icon={ShieldAlert} label="Réu Preso" value={stats.presos} hint="Casos com prisão" />
        <StatCard t="warning" icon={Stethoscope} label="Med. protetivas" value={stats.protetiva} hint="Ativas" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Alertas críticos */}
        <div className="panel">
          <div className="flex items-center gap-2 pb-3">
            <Bell className="h-4 w-4 text-destructive" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-destructive">Alertas críticos</h3>
          </div>
          <ul className="mt-2 space-y-1">
            {[
              { t: "Inquéritos em prazo crítico", s: "Menos de 3 dias para vencer", n: stats.critico, c: "destructive" },
              { t: "Casos prioridade ALTA", s: "Demandam ação imediata", n: stats.alta, c: "warning" },
              { t: "CVLI sem relatar", s: "IP de homicídios pendentes", n: cvliPend, c: "info" },
              { t: "Crimes Sexuais sem relatar", s: "Aguardando conclusão", n: sexPend, c: "violet" },
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/40">
                <span className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: a.c==='violet' ? COLORS.violet : `hsl(var(--${a.c}))`, color: a.c==='violet' ? COLORS.violet : `hsl(var(--${a.c}))` }} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{a.t}</p>
                  <p className="text-[11px] text-muted-foreground">{a.s}</p>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-[11px] font-extrabold tabular-nums ${
                  a.c==='destructive'?'border-destructive/40 bg-destructive/15 text-destructive':
                  a.c==='warning'?'border-warning/40 bg-warning/15 text-warning':
                  a.c==='violet'?'border-[hsl(270_70%_60%/0.4)] bg-[hsl(270_70%_60%/0.15)] text-[hsl(270_80%_75%)]':
                  'border-info/40 bg-info/15 text-info'
                }`}>{a.n}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pendências */}
        <div className="panel">
          <div className="flex items-center gap-2 pb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-warning">Pendências por categoria</h3>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {[
              { l: "IP de CVLI sem relatar", n: cvliPend, c: "info" },
              { l: "IP de Crimes Sexuais sem relatar", n: sexPend, c: "violet" },
              { l: "IP de Violência Doméstica sem relatar", n: vdPend, c: "warning" },
              { l: "APF não relatados", n: apfPend, c: "destructive" },
            ].sort((a:any,b:any)=>b.n-a.n).map(({ l, n, c }: any) => (
              <li key={l} className="flex items-center justify-between rounded-md px-2 py-2.5 transition-colors hover:bg-muted/40">
                <span className="flex items-center gap-2.5 text-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ background: c==='violet' ? COLORS.violet : `hsl(var(--${c}))`, color: c==='violet' ? COLORS.violet : `hsl(var(--${c}))` }} />
                  {l}
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-[11px] font-extrabold tabular-nums ${
                  c==='destructive'?'border-destructive/40 bg-destructive/15 text-destructive':
                  c==='warning'?'border-warning/40 bg-warning/15 text-warning':
                  c==='violet'?'border-[hsl(270_70%_60%/0.4)] bg-[hsl(270_70%_60%/0.15)] text-[hsl(270_80%_75%)]':
                  'border-info/40 bg-info/15 text-info'
                }`}>{n}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Meta de conclusão */}
        <div className="panel">
          <div className="flex items-center gap-2 pb-3">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Meta de conclusão</h3>
          </div>
          <ul className="mt-2 space-y-0.5 text-sm">
            {[
              ["Procedimentos cadastrados", stats.total, COLORS.info],
              ["Relatórios enviados", relatados, COLORS.primary],
              ["Em andamento", stats.andamento, COLORS.warning],
              ["Relatados não enviados", naoEnviados, COLORS.violet],
            ].map(([l, n, c]: any) => (
              <li key={l} className="flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-muted/40">
                <span className="flex items-center gap-2.5 text-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                  {l}
                </span>
                <span className="font-extrabold tabular-nums" style={{ color: c }}>{n}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-background/40 p-3">
            <div>
              <p className="text-xs font-semibold text-foreground">Taxa de conclusão atual</p>
              <p className="text-[11px] text-muted-foreground">Meta: 45% — atual {taxa.toFixed(2)}%</p>
            </div>
            <div className="relative h-14 w-14 shrink-0">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${Math.min(100,taxa).toFixed(2)}, 100`}
                  style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary)/0.7))" }} />
              </svg>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-primary">
                {taxa.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donut Status + Donut Prioridade + Procedimentos por tipo */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel group transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Por status de diligência</h3>
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          </div>
          <div className="grid grid-cols-2 items-center gap-3">
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {statusData.map((d, i) => (
                      <filter key={i} id={`glow-st-${i}`} x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    ))}
                  </defs>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="hsl(var(--card))" strokeWidth={2}>
                    {statusData.map((d, i) => <Cell key={i} fill={d.color} filter={`url(#glow-st-${i})`} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-foreground" style={{ textShadow: "0 0 18px hsl(var(--primary)/0.5)" }}>{statusTotal}</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs">
              {statusData.map(d => (
                <li key={d.name} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: d.color, color: d.color }} />
                    <span className="font-medium text-foreground/90">{d.name}</span>
                  </span>
                  <span className="font-bold tabular-nums text-foreground">
                    {d.value} <span className="text-[10px] font-medium text-muted-foreground">({Math.round((d.value/Math.max(1,statusTotal))*100)}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel group transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Por prioridade</h3>
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          </div>
          <div className="grid grid-cols-2 items-center gap-3">
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {prioData.map((d, i) => (
                      <filter key={i} id={`glow-pr-${i}`} x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    ))}
                  </defs>
                  <Pie data={prioData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="hsl(var(--card))" strokeWidth={2}>
                    {prioData.map((d, i) => <Cell key={i} fill={d.color} filter={`url(#glow-pr-${i})`} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-foreground" style={{ textShadow: "0 0 18px hsl(var(--primary)/0.5)" }}>{prioTotal}</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs">
              {prioData.map(d => (
                <li key={d.name} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: d.color, color: d.color }} />
                    <span className="font-medium text-foreground/90">{d.name}</span>
                  </span>
                  <span className="font-bold tabular-nums text-foreground">
                    {d.value} <span className="text-[10px] font-medium text-muted-foreground">({Math.round((d.value/Math.max(1,prioTotal))*100)}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel group transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)]">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Procedimentos por tipo</h3>
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          </div>
          <div className="space-y-3.5">
            {porTipo.map(({ t, n }) => (
              <div key={t} className="group/row">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-bold tracking-wide text-foreground/90">{t}</span>
                  <span className="font-extrabold tabular-nums text-primary">{n}</span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full border border-border/60 bg-muted/40">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-[0_0_10px_hsl(var(--primary)/0.6)] transition-all duration-700"
                    style={{ width: `${(n/maxTipo)*100}%` }} />
                </div>
              </div>
            ))}
            <p className="pt-2 text-[10px] leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground/70">IP:</span> Inquéritos · <span className="font-bold text-foreground/70">APF:</span> Flagrantes · <span className="font-bold text-foreground/70">TCO:</span> Termos · <span className="font-bold text-foreground/70">BOC:</span> Boletins · <span className="font-bold text-foreground/70">AIAI:</span> Ato Infracional
            </p>
          </div>
        </div>
      </div>

      {/* CVLI Comparativo + Resumo */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel lg:col-span-2">
          <h3 className="label-eyebrow text-info border-b border-border pb-3">CVLI — Comparativo anual</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cvliAnual}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="l" dataKey="reg" name="Registros" fill={COLORS.info} radius={[4,4,0,0]} />
                <Bar yAxisId="l" dataKey="eluc" name="Elucidados" fill={COLORS.primary} radius={[4,4,0,0]} />
                <Line yAxisId="r" type="monotone" dataKey="taxa" name="Taxa de elucidação (%)" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h3 className="label-eyebrow text-info border-b border-border pb-3">CVLI — Resumo anual</h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Ano</th>
                <th className="py-2 text-right">Reg</th>
                <th className="py-2 text-right">Eluc</th>
                <th className="py-2 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {cvliAnual.map(r => (
                <tr key={r.ano} className="border-t border-border/40">
                  <td className="py-2.5 font-semibold">{r.ano}</td>
                  <td className="py-2.5 text-right">{r.reg}</td>
                  <td className="py-2.5 text-right">{r.eluc}</td>
                  <td className="py-2.5 text-right text-primary">{r.taxa.toFixed(1).replace('.',',')}%</td>
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="py-2.5 font-bold">TOTAL</td>
                <td className="py-2.5 text-right font-bold">{cvliTotal.reg}</td>
                <td className="py-2.5 text-right font-bold">{cvliTotal.eluc}</td>
                <td className="py-2.5 text-right font-bold text-primary">{cvliTotalPct.toFixed(1).replace('.',',')}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CVLI mensal + Localidade */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <h3 className="label-eyebrow text-info border-b border-border pb-3">CVLI — Registros mensais (2023–2026)</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cvliMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="2023" fill={COLORS.muted} radius={[2,2,0,0]} />
                <Bar dataKey="2024" fill={COLORS.danger} radius={[2,2,0,0]} />
                <Bar dataKey="2025" fill={COLORS.warning} radius={[2,2,0,0]} />
                <Bar dataKey="2026" fill={COLORS.info} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="h-4 w-4 text-warning" />
            <h3 className="label-eyebrow text-warning">Análise por localidade</h3>
          </div>
          <div className="mt-3 max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2">Bairro</th>
                  <th className="py-2 text-right">Total</th>
                  <th className="py-2 text-right">CVLI</th>
                  <th className="py-2 text-right">Alta</th>
                </tr>
              </thead>
              <tbody>
                {porBairro.map(b => (
                  <tr key={b.bairro} className="border-t border-border/40">
                    <td className="py-2 font-semibold">{b.bairro}</td>
                    <td className="py-2 text-right">{b.total}</td>
                    <td className="py-2 text-right text-destructive">{b.cvli}</td>
                    <td className="py-2 text-right text-warning">{b.alta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gravidade + Equipe */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <h3 className="label-eyebrow text-destructive border-b border-border pb-3">Análise por gravidade</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porGrav} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis dataKey="g" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={130} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="n" fill={COLORS.danger} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="label-eyebrow text-primary">Distribuição por equipe</h3>
          </div>
          <div className="mt-4 space-y-4">
            {porEquipe.map(({ e, n }) => {
              const pct = Math.round((n / Math.max(1, eqTotal)) * 100);
              return (
                <div key={e}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold">{e}</span>
                    <span className="text-muted-foreground">{n} ({pct}%)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg border border-info/30 bg-info/10 p-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-info">
              <Activity className="h-3.5 w-3.5" /> Elucidações CVLI {new Date().getFullYear()}
            </div>
            <p className="mt-1 text-muted-foreground">
              Equipe IPC Marluan / IPC Rivaldo:{" "}
              <span className="font-bold text-primary">
                {cvliList.filter(i => yearOf(i.dataFato) === new Date().getFullYear() && (i.statusDiligencias === "Concluída" || i.situacao === "Relatado")).length} casos elucidados
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Produtividade + Carga semana + Ranking */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Gauge className="h-4 w-4 text-primary" />
            <h3 className="label-eyebrow text-primary">Produtividade operacional</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { l: "Novos (7d)", v: novos7, c: COLORS.info },
              { l: "Concluídos (7d)", v: concl7, c: COLORS.primary },
              { l: "Novos (30d)", v: novos30, c: COLORS.info },
              { l: "Concluídos (30d)", v: concl30, c: COLORS.primary },
            ].map(b => (
              <div key={b.l} className="rounded-lg border border-border/60 bg-background/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{b.l}</p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums" style={{ color: b.c }}>{b.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold">Cumprimento de SLA</span>
              <span className={`font-bold ${slaPct >= 75 ? 'text-primary' : slaPct >= 50 ? 'text-warning' : 'text-destructive'}`}>{slaPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full transition-all" style={{
                width: `${slaPct}%`,
                background: slaPct >= 75 ? COLORS.primary : slaPct >= 50 ? COLORS.warning : COLORS.danger,
              }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Tempo médio de tramitação: <span className="font-bold text-foreground">{tempoMedio} dias</span>
            </p>
          </div>
        </div>

        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <CalendarDays className="h-4 w-4 text-info" />
            <h3 className="label-eyebrow text-info">Carga por dia da semana</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {cargaSemana.map(c => {
              const pct = (c.n / maxCarga) * 100;
              const color = pct > 75 ? COLORS.danger : pct > 50 ? COLORS.warning : COLORS.primary;
              return (
                <div key={c.w} className="flex items-center gap-3">
                  <span className="w-9 text-xs font-bold text-muted-foreground">{c.w}</span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-muted/60">
                    <div className="h-full rounded-md transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-[11px] font-bold tabular-nums">{c.n}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Distribuição de instaurações por dia da semana — identifica picos operacionais.
          </p>
        </div>

        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <UserCog className="h-4 w-4 text-warning" />
            <h3 className="label-eyebrow text-warning">Ranking de escrivães</h3>
          </div>
          <div className="mt-3 max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2">Escrivão</th>
                  <th className="py-2 text-right">Casos</th>
                  <th className="py-2 text-right">Concl.</th>
                  <th className="py-2 text-right">Crít.</th>
                  <th className="py-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map(r => (
                  <tr key={r.e} className="border-t border-border/40">
                    <td className="py-2 pr-2 font-semibold line-clamp-1 max-w-[140px]">{r.e}</td>
                    <td className="py-2 text-right tabular-nums">{r.total}</td>
                    <td className="py-2 text-right tabular-nums text-primary">{r.conc}</td>
                    <td className="py-2 text-right tabular-nums text-destructive">{r.crit}</td>
                    <td className={`py-2 text-right font-bold tabular-nums ${r.taxa>=50?'text-primary':r.taxa>=25?'text-warning':'text-destructive'}`}>{r.taxa}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status bar de sistema */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-card/60 px-4 py-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> SIPI v1.0.0</span>
        <span className="flex items-center gap-1.5"><Server className="h-3 w-3 text-primary" /> Núcleo: <span className="font-bold text-foreground">online</span></span>
        <span className="flex items-center gap-1.5"><Database className="h-3 w-3 text-info" /> Base sincronizada — {stats.total} registros</span>
        <span className="flex items-center gap-1.5"><Wifi className="h-3 w-3 text-primary" /> Latência <span className="font-bold text-foreground">42ms</span></span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-primary" /> Sessão segura · DELEGADO ALVES</span>
        <span className="ml-auto flex items-center gap-1.5"><Clock className="h-3 w-3" /> Última sincronização: {dt} {tm}</span>
      </div>
    </div>
  );
}
