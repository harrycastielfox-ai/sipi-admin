import { Gavel, CheckCircle2, XCircle, Activity } from "lucide-react";
import { representacoesMock } from "@/lib/representacoes";
import { cn } from "@/lib/utils";

function statusBadge(s: string) {
  if (s.includes("DEFERIDA") && !s.includes("IN")) return "bg-primary/15 text-primary border-primary/30";
  if (s.includes("CUMPRIDA")) return "bg-primary/15 text-primary border-primary/30";
  if (s.includes("INDEFERIDA")) return "bg-destructive/15 text-destructive border-destructive/30";
  if (s.includes("AGUARDANDO")) return "bg-warning/15 text-warning border-warning/30";
  return "bg-info/15 text-info border-info/30";
}

export default function Representacoes() {
  const list = representacoesMock;
  const total = list.length;
  const def = list.filter(r => r.status === "DEFERIDA" || r.status === "CUMPRIDA (POSITIVA)").length;
  const cumpridas = list.filter(r => r.status === "CUMPRIDA (POSITIVA)").length;
  const indef = list.filter(r => r.status === "INDEFERIDA").length;
  const taxa = Math.round((def / Math.max(1, total)) * 100);

  const tipos = Array.from(new Set(list.map(r => r.tipo))).map(t => {
    const arr = list.filter(r => r.tipo === t);
    const d = arr.filter(r => r.status === "DEFERIDA" || r.status === "CUMPRIDA (POSITIVA)").length;
    const c = arr.filter(r => r.status === "CUMPRIDA (POSITIVA)").length;
    return { t, total: arr.length, d, c, sucesso: Math.round((d / arr.length) * 100) };
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <div className="flex items-center gap-2"><Gavel className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-tight">Representações Judiciais</h1></div>
        <p className="mt-1 text-sm text-muted-foreground">Medidas requeridas ao Poder Judiciário</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="stat-card"><p className="label-eyebrow">Total</p><p className="mt-3 text-4xl font-extrabold text-primary">{total}</p><p className="mt-1 text-xs text-muted-foreground">Representações</p></div>
        <div className="stat-card"><p className="label-eyebrow">Deferimento</p><p className="mt-3 text-4xl font-extrabold text-primary">{taxa}%</p><p className="mt-1 text-xs text-muted-foreground">{def} deferidas</p></div>
        <div className="stat-card"><p className="label-eyebrow">Cumpridas</p><p className="mt-3 text-4xl font-extrabold text-info">{cumpridas}</p><p className="mt-1 text-xs text-muted-foreground">positivas</p></div>
        <div className="stat-card"><p className="label-eyebrow">Indeferidas</p><p className="mt-3 text-4xl font-extrabold text-destructive">{indef}</p><p className="mt-1 text-xs text-muted-foreground">não acolhidas</p></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel lg:col-span-2">
          <h3 className="label-eyebrow text-primary border-b border-border pb-3">Por tipo de representação</h3>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="py-2">Tipo</th><th className="py-2 text-right">Total</th><th className="py-2 text-right">Deferidas</th><th className="py-2 text-right">Cumpridas</th><th className="py-2 text-right">% Sucesso</th></tr>
            </thead>
            <tbody>
              {tipos.map(t => (
                <tr key={t.t} className="border-t border-border/40">
                  <td className="py-2.5">{t.t}</td>
                  <td className="py-2.5 text-right">{t.total}</td>
                  <td className="py-2.5 text-right text-primary">{t.d}</td>
                  <td className="py-2.5 text-right text-info">{t.c}</td>
                  <td className="py-2.5 text-right font-bold text-primary">{t.sucesso}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3 className="label-eyebrow text-warning border-b border-border pb-3">Status geral</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between"><span>Total de pedidos</span><span className="font-bold">{total}</span></li>
            <li className="flex justify-between"><span>Cumpridas</span><span className="font-bold text-primary">{cumpridas}</span></li>
            <li className="flex justify-between"><span>Pendentes</span><span className="font-bold text-warning">{total - def - indef}</span></li>
            <li className="flex justify-between"><span>Indeferidas</span><span className="font-bold text-destructive">{indef}</span></li>
          </ul>
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <p className="text-xs text-muted-foreground">Taxa de Deferimento</p>
            <p className="text-3xl font-extrabold text-primary">{taxa}%</p>
          </div>
        </div>
      </div>

      <div className="panel overflow-hidden p-0">
        <div className="border-b border-border px-5 py-3"><h3 className="label-eyebrow text-primary">Representações recentes</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">PPE</th><th className="px-4 py-3">Vítima</th><th className="px-4 py-3">Investigado</th>
                <th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Processo</th><th className="px-4 py-3">Data</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-primary">{r.ppe}</td>
                  <td className="px-4 py-3">{r.vitima}</td>
                  <td className="px-4 py-3">{r.investigado}</td>
                  <td className="px-4 py-3">{r.tipo}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.processo}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.data}</td>
                  <td className="px-4 py-3"><span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusBadge(r.status))}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
