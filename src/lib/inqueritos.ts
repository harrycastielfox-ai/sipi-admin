import data from "@/data/inqueritos.json";

export type Inquerito = {
  ppe: string;
  fisico?: string;
  prioridade: "ALTA" | "MÉDIA" | "BAIXA" | string;
  dataFato?: string | null;
  dataInstauracao?: string | null;
  prazo?: number;
  dataLimite?: string | null;
  diasCorridos?: number;
  tipificacao: string;
  gravidade: string;
  tipo: "IP" | "APF" | "TCO" | "BOC" | "AIAI" | string;
  reuPreso: "Sim" | "Não" | string;
  vitima: string;
  investigado: string;
  autoria: string;
  faccao: string;
  nomeFaccao?: string;
  bairro: string;
  motivacao?: string;
  equipe: string;
  escrivao?: string;
  situacao: string;
  statusDiligencias: string;
  diligenciasPendentes?: string;
  ultimaAtualizacao?: string | null;
  medidaProtetiva: string;
  numProcessoMedida?: string;
  relatorioEnviado: string;
  dataEnvioRelatorio?: string | null;
  observacoes?: string;
  qtdRepresentacoes?: number;
};

const KEY = "sipi.inqueritos";

function seed(): Inquerito[] {
  const raw = localStorage.getItem(KEY);
  if (raw) { try { return JSON.parse(raw); } catch {} }
  localStorage.setItem(KEY, JSON.stringify(data));
  return data as Inquerito[];
}

let cache: Inquerito[] = seed();

export const inqueritosStore = {
  list(): Inquerito[] { return cache; },
  get(ppe: string) { return cache.find(i => i.ppe === ppe); },
  add(i: Inquerito) {
    cache = [i, ...cache];
    localStorage.setItem(KEY, JSON.stringify(cache));
  },
  reset() {
    localStorage.removeItem(KEY);
    cache = data as Inquerito[];
    localStorage.setItem(KEY, JSON.stringify(cache));
  },
};

export const OPTIONS = {
  prioridade: ["ALTA", "MÉDIA", "BAIXA"],
  tipo: ["IP", "APF", "TCO", "BOC", "AIAI"],
  gravidade: ["CVLI", "Crimes Sexuais", "Violência Doméstica", "Crimes Contra o Patrimônio", "Crimes de Trânsito", "Drogas", "Violento", "MIAE", "Violência contra a Criança e o Adolescente", "Violência contra a pessoa Idosa", "Outro"],
  situacao: ["Instaurado", "Em Andamento", "Relatado", "Concluída"],
  statusDiligencias: ["Em Andamento", "Concluída", "Pendente", "Aguardando Terceiros", "Aguardando Aprovação/Revisão"],
  autoria: ["Determinada", "Desconhecida", "Sem Autoria"],
  faccao: ["Não", "Sim", "A definir"],
  reuPreso: ["Não", "Sim"],
  bairro: ["Centro", "Bandeirante", "Ouro Verde", "Irmã Dulce", "Monte Pascoal", "Pereirão", "Zona Rural", "Village (Jaqueira)", "Manzolão", "Francisqueto", "Dapezão", "Montinho", "Dr. Ubirajara Brito", "Ventania", "Outros"],
  simNao: ["Não", "Sim"],
};
