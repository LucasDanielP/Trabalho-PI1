export type PresetTimer = "CLASSICO" | "CUSTOMIZADO";

export type ConfiguracaoTimer = {
  id: string;
  nome: string;
  duracaoFocoMin: number;
  duracaoPausaCurtaMin: number;
  duracaoPausaLongaMin: number;
  ciclosAtePausaLonga: number;
  ehPreset: boolean;
  tipo: PresetTimer;
  usuarioId: string | null;
  criadoEm: string;
};

export type CreateConfiguracaoInput = {
  nome: string;
  duracaoFocoMin: number;
  duracaoPausaCurtaMin: number;
  duracaoPausaLongaMin: number;
  ciclosAtePausaLonga: number;
};

export type UpdateConfiguracaoInput = Partial<CreateConfiguracaoInput>;
