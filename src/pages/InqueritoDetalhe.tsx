import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Pencil, Trash2, MoveRight, FileDown, MapPin, ScanLine, Users, ClipboardList, Calendar } from "lucide-react";
import { inqueritosStore } from "@/lib/inqueritos";
import { Button } from "@/components/ui/button";

function Pill({ children, tone = "primary" }: any) {
  const map: any = {
    primary: "bg-primary/15 text-primary border-primary/30",
    danger: "bg-destructive/15 text-destructive border-destructive/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    info: "bg-info/15 text-info border-info/30",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return <span className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${map[tone]}`}>{children}</span>;
}
function Field({ label, value }: { label: string; value?: any }) {
  return (
    <div>
      <p className="label-eyebrow">{label}</p>
      <p className="mt-1 text-sm font-medium">{value || <span className="text-muted-foreground/60">—</span>}</p>
    </div>
  );
}
function Section({ icon: Icon, title, color, children }: any) {
  return (
    <div className="panel">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <Icon className={`h-4 w-4 ${color || "text-primary"}`} />
        <h3 className={`label-eyebrow ${color || "text-primary"}`}>{title}</h3>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export default function InqueritoDetalhe() {
  const { ppe = "" } = useParams();
  const nav = useNavigate();
  const i = inqueritosStore.get(decodeURIComponent(ppe));

  if (!i) {
    return (
      <div className="panel text-center">
        <p className="text-sm text-muted-foreground">Inquérito não encontrado.</p>
        <Button asChild className="mt-4"><Link to="/inqueritos">Voltar</Link></Button>
      </div>
    );
  }

  const priorTone = i.prioridade === "ALTA" ? "danger" : i.prioridade === "MÉDIA" ? "warning" : "info";
  const sitTone = i.situacao === "Relatado" || i.situacao === "Concluída" ? "primary" : i.situacao === "Em Andamento" ? "info" : "warning";
  const gravTone = ["CVLI","Crimes Sexuais"].includes(i.gravidade) ? "danger" : ["Violência Doméstica","MIAE","Violento"].includes(i.gravidade) ? "warning" : "info";

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="icon" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-mono">{i.ppe}</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground line-clamp-2">{i.tipificacao}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Última edição: {i.ultimaAtualizacao || "—"}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><FileDown className="mr-1.5 h-4 w-4" /> Gerar PDF</Button>
          <Button variant="outline" size="sm"><MoveRight className="mr-1.5 h-4 w-4" /> Movimentar</Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90"><Pencil className="mr-1.5 h-4 w-4" /> Editar</Button>
          <Button variant="outline" size="sm" className="border-destructive/40 text-destructive hover:bg-destructive/10"><Trash2 className="mr-1.5 h-4 w-4" /> Excluir</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill tone={priorTone}>{i.prioridade}</Pill>
        <Pill tone={sitTone}>{i.situacao}</Pill>
        <Pill tone={gravTone}>{i.gravidade}</Pill>
        <Pill tone="muted">{i.tipo}</Pill>
        {i.reuPreso === "Sim" && <Pill tone="danger">Réu Preso</Pill>}
        {i.medidaProtetiva === "Sim" && <Pill tone="warning">Medida Protetiva</Pill>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section icon={FileText} title="Dados Gerais">
          <Field label="Nº PPE" value={i.ppe} />
          <Field label="Data do fato" value={i.dataFato} />
          <Field label="Data de instauração" value={i.dataInstauracao} />
          <Field label="Prazo (dias)" value={i.prazo} />
          <Field label="Data limite" value={i.dataLimite} />
          <Field label="Dias corridos" value={i.diasCorridos} />
        </Section>

        <Section icon={ScanLine} title="Classificação">
          <div className="sm:col-span-2"><Field label="Tipificação" value={i.tipificacao} /></div>
          <Field label="Gravidade" value={i.gravidade} />
          <Field label="Tipo" value={i.tipo} />
          <Field label="Prioridade" value={i.prioridade} />
          <Field label="Réu preso?" value={i.reuPreso} />
        </Section>

        <Section icon={Users} title="Pessoas Envolvidas">
          <Field label="Vítima" value={i.vitima} />
          <Field label="Autor / Investigado" value={i.investigado} />
          <Field label="Autoria" value={i.autoria} />
          <Field label="Vinculado a facção?" value={i.faccao} />
          {i.nomeFaccao && <Field label="Nome da facção" value={i.nomeFaccao} />}
          <Field label="Motivação" value={i.motivacao} />
        </Section>

        <Section icon={MapPin} title="Dados Operacionais">
          <Field label="Equipe" value={i.equipe} />
          <Field label="Bairro / Distrito" value={i.bairro} />
          <Field label="Escrivão" value={i.escrivao} />
          <Field label="Status diligências" value={i.statusDiligencias} />
          <Field label="Situação" value={i.situacao} />
          <Field label="Última atualização" value={i.ultimaAtualizacao} />
        </Section>

        <Section icon={ClipboardList} title="Relatório e Jurídico">
          <Field label="Relatório enviado?" value={i.relatorioEnviado} />
          <Field label="Data envio relatório" value={i.dataEnvioRelatorio} />
          <Field label="Medida protetiva?" value={i.medidaProtetiva} />
          <Field label="Nº processo medida" value={i.numProcessoMedida} />
          <Field label="Qtd. representações" value={i.qtdRepresentacoes} />
          <Field label="Diligências pendentes" value={i.diligenciasPendentes} />
        </Section>

        <Section icon={FileText} title="Observações">
          <div className="sm:col-span-2">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {i.observacoes || "Sem observações."}
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
