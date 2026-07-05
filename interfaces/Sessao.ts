export type FaseTimer = "FOCO" | "PAUSA_CURTA" | "PAUSA_LONGA";

export type SessaoEstudo = {
  id: string;
  usuarioId: string;
  configuracaoId: string;
  inicio: string;
  fim: string | null;
  ciclosCompletos: number;
  faseAtual: FaseTimer;
  cicloAtual: number;
  finalizada: boolean;
  configuracao?: {
    id: string;
    nome: string;
    duracaoFocoMin: number;
    duracaoPausaCurtaMin: number;
    duracaoPausaLongaMin: number;
    ciclosAtePausaLonga: number;
  };
};

export type CreateSessaoInput = {
  configuracaoId: string;
};

export type UpdateSessaoInput = {
  ciclosCompletos?: number;
  faseAtual?: FaseTimer;
  cicloAtual?: number;
  fim?: string | null;
  finalizada?: boolean;
};

export type PontoGrafico = {
  data: string;
  ciclos: number;
  minutosEstudados: number;
};

export type ResumoDados = {
  ofensivaDias: number;
  totalMinutosFoco: number;
  totalCiclos: number;
  hojeMinutosFoco: number;
  hojeCiclos: number;
  hojeMinutosDescanso: number;
  graficoMinutos: PontoGrafico[];
  graficoCiclos: PontoGrafico[];
};
