import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, AlertTriangle, RefreshCw, FileText } from "lucide-react";
import { inqueritosStore, OPTIONS } from "@/lib/inqueritos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function priorBadge(p: string) {
  const map: Record<string, string> = {
    ALTA: "bg-destructive/15 text-destructive border-destructive/30",
    MÉDIA: "bg-warning/15 text-warning border-warning/30",
    BAIXA: "bg-info/15 text-info border-info/30",
  };
  return cn("rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[p] || "bg-muted text-muted-foreground border-border");
}
function gravBadge(g: string) {
  const danger = ["CVLI", "Crimes Sexuais"];
  const warn = ["Violência Doméstica", "MIAE", "Violento"];
  if (danger.includes(g)) return "bg-destructive/15 text-destructive border-destructive/30";
  if (warn.includes(g)) return "bg-warning/15 text-warning border-warning/30";
  return "bg-info/15 text-info border-info/30";
}
function sitBadge(s: string) {
  if (s === "Relatado" || s === "Concluída") return "bg-primary/15 text-primary border-primary/30";
  if (s === "Em Andamento") return "bg-info/15 text-info border-info/30";
  return "bg-warning/15 text-warning border-warning/30";
}

export default function Inqueritos() {
  const all = inqueritosStore.list();
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [grav, setGrav] = useState("");
  const [prior, setPrior] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return all.filter(i => {
      if (ql && !`${i.ppe} ${i.vitima} ${i.investigado} ${i.tipificacao}`.toLowerCase().includes(ql)) return false;
      if (tipo && i.tipo !== tipo) return false;
      if (grav && i.gravidade !== grav) return false;
      if (prior && i.prioridade !== prior) return false;
      return true;
    });
  }, [all, q, tipo, grav, prior]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight">Inquéritos</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} de {all.length} caso(s) encontrado(s)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
        </Button>
      </div>

      <div className="panel">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por PPE, vítima ou suspeito…" className="h-11 pl-10" />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(s => !s)} className="h-11">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Todos os tipos</option>
              {OPTIONS.tipo.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={grav} onChange={e => setGrav(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Toda gravidade</option>
              {OPTIONS.gravidade.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={prior} onChange={e => setPrior(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Toda prioridade</option>
              {OPTIONS.prioridade.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="panel overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">PPE</th>
                <th className="px-4 py-3">Tipificação</th>
                <th className="px-4 py-3">Vítima</th>
                <th className="px-4 py-3">Prioridade</th>
                <th className="px-4 py-3">Gravidade</th>
                <th className="px-4 py-3">Situação</th>
                <th className="px-4 py-3">Equipe</th>
                <th className="px-4 py-3">Prazo</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const critico = (i.diasCorridos ?? 0) >= (i.prazo ?? 30) - 3;
                return (
                  <tr key={i.ppe} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-primary">
                      <div className="flex items-center gap-1.5">
                        {critico && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                        {i.ppe}
                        {(i.qtdRepresentacoes ?? 0) > 0 && (
                          <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{i.qtdRepresentacoes}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[340px]">
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{i.tipificacao}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]"><p className="line-clamp-2">{i.vitima}</p></td>
                    <td className="px-4 py-3"><span className={priorBadge(i.prioridade)}>{i.prioridade}</span></td>
                    <td className="px-4 py-3"><span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", gravBadge(i.gravidade))}>{i.gravidade}</span></td>
                    <td className="px-4 py-3"><span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", sitBadge(i.situacao))}>{i.situacao}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{i.equipe || "Sem equipe"}</td>
                    <td className={cn("px-4 py-3 font-mono text-xs", critico ? "text-destructive font-bold" : "text-muted-foreground")}>{i.dataLimite || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/inqueritos/${encodeURIComponent(i.ppe)}`}><Eye className="mr-1.5 h-3.5 w-3.5" /> Abrir</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum inquérito encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
