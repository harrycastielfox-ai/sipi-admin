export type Representacao = {
  id: number;
  ppe: string;
  vitima: string;
  investigado: string;
  tipo: string;
  processo: string;
  vara?: string;
  data: string;
  status: "EM ANÁLISE" | "AGUARDANDO ANÁLISE JUDICIAL" | "DEFERIDA" | "INDEFERIDA" | "CUMPRIDA (POSITIVA)";
};

export const representacoesMock: Representacao[] = [
  { id: 1, ppe: "72921/2025", vitima: "Jose Vitor Carvalho de Jesus", investigado: "Ana Luiza Santos", tipo: "Outros", processo: "8001619-92.2025.8.05.0111", vara: "Vara Plena de Itabela", data: "2025-11-03", status: "EM ANÁLISE" },
  { id: 2, ppe: "28259/2025", vitima: "Maria Angelina Resende de Jesus", investigado: "Silvanio Alves Lacerda", tipo: "Prisão Preventiva", processo: "8001618-10.2025.8.05.0111", vara: "Vara Plena de Itabela", data: "2025-11-03", status: "AGUARDANDO ANÁLISE JUDICIAL" },
  { id: 3, ppe: "118411/2025", vitima: "(Estado)", investigado: "Ionan G. Toscano de Britto; Vanderson Pena", tipo: "Prisão Temporária", processo: "8001651-97.2025.8.05.0111", vara: "Vara Plena de Itabela", data: "2025-11-06", status: "INDEFERIDA" },
  { id: 4, ppe: "118411/2025", vitima: "(Estado)", investigado: "Ionan G. Toscano + 2", tipo: "Busca e Apreensão Domiciliar", processo: "8001651-97.2025.8.05.0111", vara: "Vara Plena de Itabela", data: "2025-11-06", status: "CUMPRIDA (POSITIVA)" },
  { id: 5, ppe: "118411/2025", vitima: "(Estado)", investigado: "Ionan G. Toscano + 2", tipo: "Interceptação Telefônica", processo: "8001651-97.2025.8.05.0111", vara: "Vara Plena de Itabela", data: "2025-11-06", status: "DEFERIDA" },
  { id: 6, ppe: "21062/2026", vitima: "(Estado)", investigado: "Gabriel Alves de Oliveira", tipo: "Quebra de Sigilo", processo: "8000201-11.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-01-20", status: "DEFERIDA" },
  { id: 7, ppe: "8630/2026", vitima: "Jeferson Pereira da Silva", investigado: "Desconhecidos", tipo: "Busca e Apreensão", processo: "8000305-44.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-02-12", status: "DEFERIDA" },
  { id: 8, ppe: "25872/2026", vitima: "Vagner Castro dos Santos", investigado: "Desconhecidos", tipo: "Quebra de Sigilo / Interceptação", processo: "8000412-77.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-02-28", status: "DEFERIDA" },
  { id: 9, ppe: "25870/2026", vitima: "Charles Silva Amaral", investigado: "Desconhecidos", tipo: "Busca e Apreensão", processo: "8000511-22.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-03-05", status: "DEFERIDA" },
  { id: 10, ppe: "14394/2026", vitima: "Gabriel Alves de Oliveira", investigado: "Desconhecidos", tipo: "Busca e Apreensão", processo: "8000620-33.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-03-11", status: "DEFERIDA" },
  { id: 11, ppe: "33908/2026", vitima: "CLÍNICA VOLTE A SORRIR", investigado: "Henrique Marques Alceu", tipo: "Prisão Preventiva", processo: "8000730-12.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-04-08", status: "DEFERIDA" },
  { id: 12, ppe: "32786/2026", vitima: "Rhani Kelly Silva de Araujo", investigado: "Netival Santos Santana", tipo: "Quebra de Sigilo", processo: "8000841-66.2026.8.05.0111", vara: "Vara Plena de Itabela", data: "2026-04-09", status: "DEFERIDA" },
];
