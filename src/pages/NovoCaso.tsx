import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Save, ArrowLeft } from "lucide-react";
import { inqueritosStore, OPTIONS, type Inquerito } from "@/lib/inqueritos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

function Sel({ value, onChange, options, placeholder }: any) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
      <option value="">{placeholder || "Selecione…"}</option>
      {options.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  );
}
function Section({ title, children }: any) {
  return (
    <section className="panel">
      <h3 className="label-eyebrow text-primary border-b border-border pb-3">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export default function NovoCaso() {
  const nav = useNavigate();
  const [f, setF] = useState<Partial<Inquerito>>({
    prioridade: "MÉDIA", tipo: "IP", gravidade: "Outro", reuPreso: "Não",
    autoria: "Determinada", faccao: "Não", medidaProtetiva: "Não", relatorioEnviado: "Não",
    situacao: "Instaurado", statusDiligencias: "Em Andamento", equipe: "DT Itabela", prazo: 30,
  });
  const set = (k: keyof Inquerito) => (v: any) => setF(s => ({ ...s, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.ppe || !f.tipificacao) {
      toast({ title: "Campos obrigatórios", description: "Informe Nº PPE e tipificação.", variant: "destructive" });
      return;
    }
    const novo: Inquerito = {
      ...(f as Inquerito),
      diasCorridos: 0,
      qtdRepresentacoes: 0,
      ultimaAtualizacao: new Date().toISOString().slice(0, 10),
    };
    inqueritosStore.add(novo);
    toast({ title: "Inquérito cadastrado", description: `PPE ${novo.ppe} registrado com sucesso.` });
    nav(`/inqueritos/${encodeURIComponent(novo.ppe)}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="icon" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-extrabold tracking-tight">Novo Caso</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Cadastre um novo procedimento policial</p>
          </div>
        </div>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-elegant)]">
          <Save className="mr-2 h-4 w-4" /> Salvar inquérito
        </Button>
      </div>

      <Section title="Dados gerais">
        <div><Label>Nº PPE *</Label><Input value={f.ppe || ""} onChange={e => set("ppe")(e.target.value)} placeholder="Ex.: 12345/2026" /></div>
        <div><Label>Nº físico</Label><Input value={f.fisico || ""} onChange={e => set("fisico")(e.target.value)} /></div>
        <div><Label>Prioridade</Label><Sel value={f.prioridade} onChange={set("prioridade")} options={OPTIONS.prioridade} /></div>
        <div><Label>Data do fato</Label><Input type="date" value={f.dataFato || ""} onChange={e => set("dataFato")(e.target.value)} /></div>
        <div><Label>Data de instauração</Label><Input type="date" value={f.dataInstauracao || ""} onChange={e => set("dataInstauracao")(e.target.value)} /></div>
        <div><Label>Prazo (dias)</Label><Input type="number" value={f.prazo ?? 30} onChange={e => set("prazo")(Number(e.target.value))} /></div>
        <div><Label>Data limite</Label><Input type="date" value={f.dataLimite || ""} onChange={e => set("dataLimite")(e.target.value)} /></div>
      </Section>

      <Section title="Classificação">
        <div className="sm:col-span-2 lg:col-span-3"><Label>Tipificação *</Label><Textarea rows={3} value={f.tipificacao || ""} onChange={e => set("tipificacao")(e.target.value)} placeholder="Descreva a tipificação criminal" /></div>
        <div><Label>Gravidade</Label><Sel value={f.gravidade} onChange={set("gravidade")} options={OPTIONS.gravidade} /></div>
        <div><Label>Tipo</Label><Sel value={f.tipo} onChange={set("tipo")} options={OPTIONS.tipo} /></div>
        <div><Label>Réu preso?</Label><Sel value={f.reuPreso} onChange={set("reuPreso")} options={OPTIONS.reuPreso} /></div>
      </Section>

      <Section title="Pessoas envolvidas">
        <div className="sm:col-span-2"><Label>Vítima</Label><Input value={f.vitima || ""} onChange={e => set("vitima")(e.target.value)} /></div>
        <div><Label>Autor/Investigado</Label><Input value={f.investigado || ""} onChange={e => set("investigado")(e.target.value)} /></div>
        <div><Label>Autoria</Label><Sel value={f.autoria} onChange={set("autoria")} options={OPTIONS.autoria} /></div>
        <div><Label>Vinculado a facção?</Label><Sel value={f.faccao} onChange={set("faccao")} options={OPTIONS.faccao} /></div>
        <div><Label>Nome da facção</Label><Input value={f.nomeFaccao || ""} onChange={e => set("nomeFaccao")(e.target.value)} /></div>
        <div><Label>Motivação</Label><Input value={f.motivacao || ""} onChange={e => set("motivacao")(e.target.value)} /></div>
      </Section>

      <Section title="Operacional">
        <div><Label>Bairro / Distrito</Label><Sel value={f.bairro} onChange={set("bairro")} options={OPTIONS.bairro} /></div>
        <div><Label>Equipe</Label><Input value={f.equipe || ""} onChange={e => set("equipe")(e.target.value)} /></div>
        <div><Label>Escrivão</Label><Input value={f.escrivao || ""} onChange={e => set("escrivao")(e.target.value)} /></div>
        <div><Label>Situação</Label><Sel value={f.situacao} onChange={set("situacao")} options={OPTIONS.situacao} /></div>
        <div><Label>Status diligências</Label><Sel value={f.statusDiligencias} onChange={set("statusDiligencias")} options={OPTIONS.statusDiligencias} /></div>
        <div><Label>Diligências pendentes</Label><Input value={f.diligenciasPendentes || ""} onChange={e => set("diligenciasPendentes")(e.target.value)} /></div>
      </Section>

      <Section title="Relatório e jurídico">
        <div><Label>Medida protetiva?</Label><Sel value={f.medidaProtetiva} onChange={set("medidaProtetiva")} options={OPTIONS.simNao} /></div>
        <div><Label>Nº processo medida</Label><Input value={f.numProcessoMedida || ""} onChange={e => set("numProcessoMedida")(e.target.value)} /></div>
        <div><Label>Relatório enviado?</Label><Sel value={f.relatorioEnviado} onChange={set("relatorioEnviado")} options={OPTIONS.simNao} /></div>
        <div><Label>Data envio relatório</Label><Input type="date" value={f.dataEnvioRelatorio || ""} onChange={e => set("dataEnvioRelatorio")(e.target.value)} /></div>
        <div className="sm:col-span-2 lg:col-span-3"><Label>Observações</Label><Textarea rows={4} value={f.observacoes || ""} onChange={e => set("observacoes")(e.target.value)} /></div>
      </Section>

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-elegant)]">
          <Save className="mr-2 h-4 w-4" /> Salvar inquérito
        </Button>
      </div>
    </form>
  );
}
