export type PresetTimer = 'CLASSICO' | 'CUSTOMIZADO';
export type FaseTimer = 'FOCO' | 'PAUSA_CURTA' | 'PAUSA_LONGA';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
}

export interface ConfiguracaoTimer {
  id: string;
  nome: string;
  duracaoFocoMin: number;
  duracaoPausaCurtaMin: number;
  duracaoPausaLongaMin: number;
  ciclosAtePausaLonga: number;
  ehPreset: boolean;
  tipo?: PresetTimer;
}

export interface EstadoTimer {
  faseAtual: FaseTimer;
  cicloAtual: number;
  tempoRestanteSeg: number;
  configuracaoId: string;
}

export interface SessaoEstudo {
  id: string;
  usuarioId: string;
  inicio: Date;
  fim: Date | null;
  ciclosCompletos: number;
  estado: EstadoTimer;
  configuracaoId: string;
}

export interface Periodo {
  inicio: Date;
  fim: Date;
}

export interface PontoGrafico {
  data: Date;
  ciclos: number;
  minutosEstudados: number;
}

export interface GraficoEstudo {
  usuarioId: string;
  periodo: Periodo;
  pontos: PontoGrafico[];
}

export interface ResumoDiario {
  data: Date;
  totalCiclos: number;
  tempoTotalMin: number;
  sessoes: SessaoEstudo[];
}
